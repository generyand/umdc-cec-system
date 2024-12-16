import React from 'react';
import { Download, Info, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const ExtensionManual = () => {
  const pdfUrl = "/src/assets/documents/CEC-Manual.pdf";

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          {/* Logos Container */}
          <div className="flex justify-center items-center gap-12 mb-8">
            <img 
              src="/src/assets/images/umdc-logo.png" 
              alt="University of Mindanao Logo" 
              className="h-28 w-auto transition-transform hover:scale-105"
            />
            <img 
              src="/src/assets/images/cec-logo.png" 
              alt="Community Extension Center Logo" 
              className="h-28 w-auto transition-transform hover:scale-105"
            />
          </div>
          
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">
              Community Extension Center Manual
            </h1>
            <Separator className="mx-auto w-24" />
            {/* Description Section */}
            <div className="max-w-3xl mx-auto">
              <p className="text-gray-600 leading-relaxed mb-4">
                This manual serves as a comprehensive guide for the Community Extension Center's 
                operations, policies, and procedures. It provides essential information for faculty, 
                staff, and stakeholders involved in community extension activities.
              </p>
              <p className="text-gray-600 leading-relaxed">
                The document outlines the center's mission, vision, organizational structure, 
                and detailed guidelines for implementing community extension programs and activities.
              </p>
            </div>
          </div>
        </header>

        <main className="mb-12">
          <Card className="p-8 bg-white shadow-lg rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold text-gray-900">Manual PDF</h2>
              </div>
              <Button 
                onClick={() => window.open(pdfUrl, '_blank')}
                className="flex items-center gap-2 shadow-sm"
                size="lg"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </Button>
            </div>
          
            {/* PDF Viewer */}
            <div className="w-full aspect-[1/1.4] border border-gray-200 rounded-lg overflow-hidden bg-white shadow-inner">
              <iframe
                src={`${pdfUrl}#view=FitH`}
                className="w-full h-full"
                title="Extension Manual PDF"
              />
            </div>
          </Card>
        </main>

        <footer className="text-center space-y-3 py-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Info className="w-5 h-5" />
            <span className="font-medium">Need Help?</span>
          </div>
          <p className="text-gray-600">
            For questions or technical support, please contact our support team.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ExtensionManual;