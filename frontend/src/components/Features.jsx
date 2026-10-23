import { Headphones, Shield, Truck } from 'lucide-react'
import React from 'react'

const Features = () => {
  return (
    <section className="py-10 sm:py-14 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-white shadow-xs border border-gray-100">
            <div className="h-12 w-12 shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
              <Truck className="text-blue-600 h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-base">Free Shipping</h3>
              <p className="text-sm text-gray-500">
                On orders over ₹299.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-xl bg-white shadow-xs border border-gray-100">
            <div className="h-12 w-12 shrink-0 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="text-green-600 h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-base">Secure Payment</h3>
              <p className="text-sm text-gray-500">
                100% Secure transactions.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-xl bg-white shadow-xs border border-gray-100 sm:col-span-2 md:col-span-1">
            <div className="h-12 w-12 shrink-0 bg-purple-100 rounded-full flex items-center justify-center">
              <Headphones className="text-purple-600 h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-base">24/7 Support</h3>
              <p className="text-sm text-gray-500">
               Always here to help.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Features