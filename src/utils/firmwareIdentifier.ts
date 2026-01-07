export interface FirmwareInfo {
  type: 'official-english' | 'official-chinese' | 'crosspoint' | 'unknown';
  version: string;
  displayName: string;
}

/**
 * Find a string in binary data
 */
function findString(data: Uint8Array, searchString: string): boolean {
  const encoder = new TextEncoder();
  const searchBytes = encoder.encode(searchString);

  if (data.length < searchBytes.length) {
    return false;
  }

  for (let i = 0; i <= data.length - searchBytes.length; i++) {
    let match = true;
    for (let j = 0; j < searchBytes.length; j++) {
      if (data[i + j] !== searchBytes[j]) {
        match = false;
        break;
      }
    }
    if (match) {
      return true;
    }
  }

  return false;
}

/**
 * Extract version string from firmware binary
 * Looks for both "V*.*.* " pattern (official) and "*.*.* " pattern (CrossPoint)
 */
function extractVersion(data: Uint8Array): string {
  const decoder = new TextDecoder('utf-8', { fatal: false });

  // Try to find V-pattern versions (official firmware)
  for (let i = 0; i < Math.min(data.length - 8, 100000); i++) {
    if (data[i] === 0x56) {
      // 'V' character
      const chunk = decoder.decode(data.slice(i, Math.min(i + 10, data.length)));
      const match = chunk.match(/V\d+\.\d+\.\d+/);
      if (match) {
        return match[0];
      }
    }
  }

  // Try to find numeric versions (CrossPoint: 0.12.0, etc.)
  try {
    const fullString = decoder.decode(data);
    const lines = fullString.split(/[\x00\n]/);
    for (const line of lines) {
      const match = line.match(/^\d+\.\d+\.\d+$/);
      if (match && !line.includes('.')) {
        // Make sure it's actually a version number, not part of a path
        if (line.match(/^[0-9]+\.[0-9]+\.[0-9]+$/)) {
          return match[0];
        }
      }
    }

    // Also search for version in common patterns
    const versionMatch = fullString.match(/(?:Version[:\s]*)(\d+\.\d+\.\d+)/i);
    if (versionMatch) {
      return versionMatch[1];
    }
  } catch {
    // Decoding failed, continue
  }

  return 'unknown';
}

/**
 * Identify firmware type and extract version information
 * This function analyzes the binary to determine if it's Official English,
 * Official Chinese, CrossPoint, or Unknown firmware
 *
 * @param firmwareData - The raw firmware binary data
 * @returns FirmwareInfo object with type, version, and display name
 */
export function identifyFirmware(firmwareData: Uint8Array): FirmwareInfo {
  // Check for Official English firmware
  if (findString(firmwareData, 'End of English')) {
    return {
      type: 'official-english',
      version: extractVersion(firmwareData),
      displayName: 'Official English',
    };
  }

  // Check for Official Chinese firmware
  if (findString(firmwareData, 'XTOS')) {
    return {
      type: 'official-chinese',
      version: extractVersion(firmwareData),
      displayName: 'Official Chinese',
    };
  }

  // Check for CrossPoint Community firmware
  if (
    findString(firmwareData, 'CrossPoint-ESP32-') ||
    findString(firmwareData, 'Starting CrossPoint version')
  ) {
    return {
      type: 'crosspoint',
      version: extractVersion(firmwareData),
      displayName: 'CrossPoint Community Reader',
    };
  }

  // Unknown firmware
  return {
    type: 'unknown',
    version: extractVersion(firmwareData),
    displayName: 'Custom/Unknown Firmware',
  };
}

/**
 * Check if identification was successful (found a known firmware type)
 * Returns false only for "unknown" firmware type
 *
 * @param info - The FirmwareInfo result
 * @returns true if firmware type was identified, false if unknown
 */
export function isIdentificationSuccessful(info: FirmwareInfo): boolean {
  return info.type !== 'unknown';
}
