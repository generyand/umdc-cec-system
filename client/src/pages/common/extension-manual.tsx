import React from 'react';
import { Download, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const ExtensionManual = () => {
  // Replace this with your actual PDF file path
  const pdfUrl = "/src/assets/documents/CEC-Manual.pdf";

  return (
    <div className="min-h-screen p-6">
      <header className="mb-8">
        {/* Logos Container */}
        <div className="flex justify-center items-center gap-8 mb-6">
          <img 
            src="/src/assets/images/umdc-logo.png" 
            alt="University of Mindanao Logo" 
            className="h-24 w-auto"
          />
          <img 
            src="/src/assets/images/cec-logo.png" 
            alt="Community Extension Center Logo" 
            className="h-24 w-auto"
          />
        </div>
        <h1 className="text-3xl font-bold text-center">
          Community Extension Center Manual
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <Card className="p-6 bg-white shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Extension Manual PDF</h2>
            <Button 
              onClick={() => window.open(pdfUrl, '_blank')}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
          
          {/* PDF Viewer */}
          <div className="w-full aspect-[1/1.4] border border-gray-200 rounded-lg overflow-hidden">
            <iframe
              src={`${pdfUrl}#view=FitH`}
              className="w-full h-full"
              title="Extension Manual PDF"
            />
          </div>
        </Card>
      </main>

      <footer className="mt-8 text-center">
        <Info className="w-6 h-6 text-blue-500 inline-block" />
        <p className="text-gray-600">
          For more information, contact support.
        </p>
      </footer>
    </div>
  );
};

export default ExtensionManual;