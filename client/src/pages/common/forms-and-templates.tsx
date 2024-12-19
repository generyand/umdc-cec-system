import React from 'react';
import { Download, FileText, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface FormTemplate {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
}

const formTemplates: FormTemplate[] = [
  {
    id: '1',
    title: 'Project Proposal Form',
    description: 'Standard template for submitting new community extension project proposals.',
    fileName: 'project-proposal-template.docx',
    fileUrl: '/src/assets/documents/project-proposal-template.docx',
    fileType: 'DOCX'
  },
];

const FormsAndTemplates = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <div className="flex justify-center items-center gap-12 mb-8">
            <img 
              src="/src/assets/images/umdc-logo.png" 
              alt="University of Mindanao Logo" 
              className="h-28 w-auto transition-transform hover:scale-105"
            />
            <img 
              src="/src/assets/images/cec-logo.webp" 
              alt="Community Extension Center Logo" 
              className="h-28 w-auto transition-transform hover:scale-105"
            />
          </div>
          
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">
              Forms and Templates
            </h1>
            <Separator className="mx-auto w-24" />
            <div className="max-w-3xl mx-auto">
              <p className="text-gray-600 leading-relaxed">
                Download the official templates and forms required for community extension projects. 
                These standardized documents ensure consistency and completeness in project 
                documentation and reporting.
              </p>
            </div>
          </div>
        </header>

        <main className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formTemplates.map((template) => (
              <Card key={template.id} className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-semibold text-gray-900">{template.title}</h2>
                    </div>
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {template.fileType}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-6 flex-grow">
                    {template.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm text-gray-500">
                      {template.fileName}
                    </span>
                    <Button 
                      onClick={() => window.open(template.fileUrl, '_blank')}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>

        <footer className="text-center space-y-3 py-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Info className="w-5 h-5" />
            <span className="font-medium">Need Help?</span>
          </div>
          <p className="text-gray-600">
            For questions about the forms or templates, please contact our support team.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default FormsAndTemplates;
