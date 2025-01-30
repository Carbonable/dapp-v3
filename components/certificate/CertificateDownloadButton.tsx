'use client'

import { useState } from 'react';
import { CertificateData } from '@/types/certificate';
import { generateCertificate } from '@/actions/generateCertificate';
import Button from '../common/Button';
import { cn } from '@heroui/react';
import { useNetwork } from '@starknet-react/core';

interface Props {
  data: CertificateData;
  disabled?: boolean;
}

export function CertificateDownloadButton({ data, disabled }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { chain } = useNetwork();

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      
      // Call server action
      const pdfBase64 = await generateCertificate(data, chain.name);
      
      // Create download link
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${pdfBase64}`;
      link.download = 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      // Handle error appropriately
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isGenerating || disabled}
      classNames={cn("text-xs w-fit px-2 py-1 whitespace-nowrap bg-greenish-500 text-neutral-50 border-greenish-500 dark:bg-greenish-500 dark:text-neutral-50 dark:border-greenish-500 hover:brightness-110", disabled && "opacity-50 cursor-not-allowed hover:opacity-50")}
    >
      {isGenerating ? 'Generating...' : 'Download Certificate'}
    </Button>
  );
}