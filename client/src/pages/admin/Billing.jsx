import { Card } from "../../components/ui/Card";
import { CreditCard, Download, Calendar } from "lucide-react";

const invoices = [
  { id: "INV-2026-05", date: "May 1, 2026", amount: "$2,499", status: "Paid" },
  { id: "INV-2026-04", date: "Apr 1, 2026", amount: "$2,499", status: "Paid" },
  { id: "INV-2026-03", date: "Mar 1, 2026", amount: "$2,499", status: "Paid" },
  { id: "INV-2026-02", date: "Feb 1, 2026", amount: "$2,499", status: "Paid" },
];

const Billing =()=> {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Billing & Subscription</h1>
        <p className="text-gray-600">Manage your subscription and payment information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Current Plan">
            <div className="p-6 bg-linear-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise Plan</h3>
                  <p className="text-gray-600 mb-4">Unlimited users and projects</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">$2,499</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
                  Change Plan
                </button>
              </div>
              <div className="pt-4 border-t border-blue-200">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4" />
                  Next billing date: June 1, 2026
                </div>
              </div>
            </div>
          </Card>

          <Card title="Billing History" className="mt-6">
            <div className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between py-4 px-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{invoice.id}</p>
                      <p className="text-sm text-gray-600">{invoice.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{invoice.amount}</p>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                        {invoice.status}
                      </span>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card title="Payment Method">
            <div className="p-6">
              <div className="bg-linear-to-br from-gray-900 to-gray-700 rounded-xl p-6 text-white mb-4">
                <div className="flex justify-between items-start mb-8">
                  <CreditCard className="w-8 h-8" />
                  <span className="text-xs">VISA</span>
                </div>
                <p className="text-lg tracking-wider mb-4">•••• •••• •••• 4242</p>
                <div className="flex justify-between text-xs">
                  <span>JOHN DOE</span>
                  <span>12/28</span>
                </div>
              </div>
              <button className="w-full py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                Update Payment Method
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Billing;