'use client';

import React, { useRef } from 'react';
import { Button, Heading } from '@chakra-ui/react';
import FileUpload, { FileUploadHandle } from '@/components/FileUpload';
import Steps from '@/components/Steps';
import { useEspOperations } from '@/esp/useEspOperations';
import { ColorModeButton } from '@/components/ui/color-mode';
import styles from './page.module.css';

export default function Home() {
  const { actions, stepData, isRunning } = useEspOperations();
  const fileInput = useRef<FileUploadHandle>(null);
  const getFile = () => fileInput.current?.getFile();

  return (
    <main className={styles.page}>
      <Heading size="2xl">Xteink English Firmware Flasher</Heading>
      <ColorModeButton />
      <section className={styles.section}>
        <Heading size="xl">Full flash controls</Heading>
        <Button onClick={actions.saveFullFlash} disabled={isRunning}>
          Save full flash
        </Button>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flexGrow: 1 }}>
            <FileUpload ref={fileInput} />
          </div>
          <Button
            style={{ flexGrow: 1 }}
            onClick={() => actions.writeFullFlash(getFile)}
            disabled={isRunning}
          >
            Write full flash from file
          </Button>
        </div>
      </section>
      <section className={styles.section}>
        <Heading size="xl">OTA fast flash controls</Heading>
        <Button onClick={actions.flashEnglishFirmware} disabled={isRunning}>
          Flash English firmware (3.0.8) via OTA
        </Button>
        {process.env.NODE_ENV === 'development' && (
          <Button onClick={actions.debugSteps2} disabled={isRunning}>
            debug
          </Button>
        )}
      </section>
      <section className={styles.section}>
        <Steps steps={stepData} />
      </section>
    </main>
  );
}
