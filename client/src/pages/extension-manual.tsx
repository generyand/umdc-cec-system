import React from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const ExtensionManual = () => {
  return (
    <div className="min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center">
          Community Extension Center Manual
        </h1>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-bold mb-4">
            Getting Started
          </h2>
          <p className="text-gray-700 mb-4">
            Learn how to set up and start using the community extension center.
          </p>
          <Button className="bg-blue-500 text-white hover:bg-blue-600">
            Learn More
          </Button>
        </Card>

        <Card className="p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-bold mb-4">
            Features
          </h2>
          <p className="text-gray-700 mb-4">
            Explore the features available in the extension center.
          </p>
          <Button className="bg-blue-500 text-white hover:bg-blue-600">
            Discover
          </Button>
        </Card>

        <Card className="p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-bold mb-4">
            FAQ
          </h2>
          <p className="text-gray-700 mb-4">
            Find answers to frequently asked questions.
          </p>
          <Button className="bg-blue-500 text-white hover:bg-blue-600">
            Read More
          </Button>
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
