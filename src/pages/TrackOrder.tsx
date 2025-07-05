
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Package, Truck, CheckCircle } from 'lucide-react';

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock tracking result
    if (orderNumber) {
      setTrackingResult({
        orderNumber: orderNumber,
        status: 'In Transit',
        estimatedDelivery: '2024-01-15',
        steps: [
          { status: 'Order Placed', completed: true, date: '2024-01-10' },
          { status: 'Processing', completed: true, date: '2024-01-11' },
          { status: 'Shipped', completed: true, date: '2024-01-12' },
          { status: 'In Transit', completed: true, date: '2024-01-13' },
          { status: 'Delivered', completed: false, date: 'Expected: 2024-01-15' }
        ]
      });
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-black text-white">
        <section className="bg-gradient-to-r from-purple-900 to-black py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-6xl font-black mb-6">TRACK ORDER</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Enter your order number to track your shipment
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-6 max-w-4xl">
            <form onSubmit={handleTrack} className="mb-8">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Enter your order number"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="pl-10 bg-gray-900 border-purple-700 text-white h-12"
                  />
                </div>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 px-8">
                  Track Order
                </Button>
              </div>
            </form>

            {trackingResult && (
              <div className="bg-gray-900 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-purple-400 mb-6">Order Status</h2>
                
                <div className="mb-6">
                  <p className="text-gray-400">Order Number: <span className="text-white font-bold">{trackingResult.orderNumber}</span></p>
                  <p className="text-gray-400">Current Status: <span className="text-green-400 font-bold">{trackingResult.status}</span></p>
                  <p className="text-gray-400">Estimated Delivery: <span className="text-white font-bold">{trackingResult.estimatedDelivery}</span></p>
                </div>

                <div className="space-y-4">
                  {trackingResult.steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${step.completed ? 'bg-green-600' : 'bg-gray-600'}`}>
                        {step.status === 'Order Placed' && <Package className="h-5 w-5" />}
                        {step.status === 'Processing' && <Package className="h-5 w-5" />}
                        {step.status === 'Shipped' && <Truck className="h-5 w-5" />}
                        {step.status === 'In Transit' && <Truck className="h-5 w-5" />}
                        {step.status === 'Delivered' && <CheckCircle className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold ${step.completed ? 'text-white' : 'text-gray-400'}`}>
                          {step.status}
                        </h3>
                        <p className="text-gray-400 text-sm">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default TrackOrder;
