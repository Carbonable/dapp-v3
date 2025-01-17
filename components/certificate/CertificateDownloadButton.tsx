'use client'

import { useState } from 'react';
import { CertificateData } from '@/types/certificate';
import { generateCertificate } from '@/actions/generateCertificate';
import Button from '../common/Button';

interface Props {
  data: CertificateData;
}

export function CertificateDownloadButton({ data }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      
      // Call server action
      const pdfBase64 = await generateCertificate(data);
      
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
      disabled={isGenerating}
      classNames="text-xs w-fit px-2 py-1"
    >
      {isGenerating ? 'Generating...' : 'Download Certificate'}
    </Button>
  );
}