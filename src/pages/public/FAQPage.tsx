import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import PublicLayout from '../../components/layouts/PublicLayout';
import PageHeader from '../../components/PageHeader';
import { AlertCircle, Loader2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order_num: number;
}

export default function FAQPage() {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  useEffect(() => {
    fetchFAQItems();
  }, []);

  const fetchFAQItems = async () => {
    try {
      const { data, error } = await supabase
        .from('faq_items')
        .select('*')
        .eq('is_active', true)
        .order('order_num');

      if (error) throw error;
      setFaqItems(data || []);
    } catch (err) {
      console.error('Error fetching FAQ items:', err);
      setError('Failed to load FAQs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const groupedFAQs = faqItems.reduce((acc, item) => {
    const category = item.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  const toggleItem = (id: string) => {
    setOpenItemId(openItemId === id ? null : id);
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        </div>
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <PageHeader
        kicker="Help"
        title="Frequently asked questions"
        description="Find answers to common questions about our services and mental health support."
      />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {faqItems.length === 0 ? (
          <p className="py-12 text-center text-gray-500">No FAQs available at this time.</p>
        ) : (
          <div className="space-y-14">
            {Object.entries(groupedFAQs).map(([category, items]) => (
              <section key={category}>
                <h2 className="heading-md mb-7 text-deep">{category}</h2>
                <div className="space-y-4">
                  {items.map((item) => {
                    const isOpen = openItemId === item.id;
                    return (
                      <div key={item.id} className="overflow-hidden rounded-2xl bg-white shadow-md">
                        <button
                          onClick={() => toggleItem(item.id)}
                          aria-expanded={isOpen}
                          className="flex w-full cursor-pointer items-center justify-between px-6 py-5 text-left transition-colors duration-200 hover:bg-brand-50"
                        >
                          <span className="pr-4 font-display text-lg font-semibold text-deep">
                            {item.question}
                          </span>
                          <ChevronDown
                            className={`h-5 w-5 flex-shrink-0 text-accent-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                            aria-hidden="true"
                          />
                        </button>
                        <div className={`faq-body ${isOpen ? 'open' : ''}`}>
                          <div>
                            <div className="border-t border-brand-50 px-6 pb-5 pt-4">
                              <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
                                {item.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <section className="bg-sand">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="heading-md text-deep">Still have questions?</h2>
          <p className="mt-3 text-gray-600">
            Can't find what you're looking for? Get in touch with our team.
          </p>
          <div className="mt-7">
            <Link to="/contact" className="btn-secondary">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
