import React from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

export default function SaveFullFlash({
  onClick,
  disabled,
}: Pick<ButtonProps, 'onClick' | 'disabled'>) {
  return (
    <Button onClick={onClick} disabled={disabled}>
      Save full flash
    </Button>
  );
}
