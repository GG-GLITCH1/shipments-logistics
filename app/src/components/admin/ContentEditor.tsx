import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Save, 
  Globe, 
  Image, 
  Type, 
  Layout,
  CheckCircle,
  Loader2,
  Eye
} from 'lucide-react';

interface ContentSection {
  id: string;
  name: string;
  title: string;
  content: string;
  isEditing: boolean;
}

const initialSections: ContentSection[] = [
  {
    id: 'hero',
    name: 'Hero Section',
    title: 'Smart Logistics, Seamless Deliveries',
    content: 'Manage, track, and optimize your shipments with real-time precision. The ultimate multi-tenant platform for seamless shipment tracking, logistics management, and P2P point systems.',
    isEditing: false,
  },
  {
    id: 'features',
    name: 'Features Title',
    title: 'Powerful Tools for Growth',
    content: 'Everything you need to manage complex delivery networks with ease, from dispatch to final delivery.',
    isEditing: false,
  },
  {
    id: 'how-it-works',
    name: 'How It Works Title',
    title: 'Get Started in Minutes',
    content: 'Our streamlined onboarding process gets you up and running quickly.',
    isEditing: false,
  },
  {
    id: 'testimonials',
    name: 'Testimonials Title',
    title: 'Loved by Businesses Worldwide',
    content: "Don't just take our word for it — hear what our customers have to say about their experience.",
    isEditing: false,
  },
  {
    id: 'cta',
    name: 'CTA Title',
    title: 'Ready to revolutionize your delivery operations?',
    content: 'Join over 500+ businesses using CashSupportShipment to manage millions of deliveries monthly.',
    isEditing: false,
  },
];

export default function ContentEditor() {
  const [sections, setSections] = useState<ContentSection[]>(initialSections);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  const handleEdit = (id: string) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, isEditing: true } : section
    ));
  };

  const handleSaveSection = (id: string, newTitle: string, newContent: string) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, title: newTitle, content: newContent, isEditing: false } : section
    ));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-950">Content Editor</h1>
          <p className="text-gray-500 mt-1">Edit your website content and customize the messaging</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button 
            className="bg-gradient-brand text-white hover:opacity-90 gap-2"
            onClick={handleSaveAll}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'content', label: 'Content', icon: Type },
          { id: 'appearance', label: 'Appearance', icon: Layout },
          { id: 'seo', label: 'SEO', icon: Globe },
          { id: 'media', label: 'Media', icon: Image },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-navy-950'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {sections.map((section) => (
            <ContentSectionCard
              key={section.id}
              section={section}
              onEdit={handleEdit}
              onSave={handleSaveSection}
            />
          ))}
        </div>
      )}

      {/* Appearance Tab */}
      {activeTab === 'appearance' && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-display font-semibold text-navy-950 mb-6">Brand Colors</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Primary Purple', color: '#7f56d9', variable: '--primary' },
              { name: 'Primary Teal', color: '#14b8a6', variable: '--secondary' },
              { name: 'Dark Navy', color: '#1e1b4b', variable: '--navy' },
              { name: 'Light Background', color: '#f3f4f6', variable: '--background' },
            ].map((color) => (
              <div key={color.name} className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{color.name}</label>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg shadow-inner"
                    style={{ backgroundColor: color.color }}
                  />
                  <Input value={color.color} className="flex-1" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="font-display font-semibold text-navy-950 mb-6">Typography</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Heading Font</label>
                <select className="w-full h-10 px-3 rounded-md border border-gray-200">
                  <option>Space Grotesk</option>
                  <option>Inter</option>
                  <option>Poppins</option>
                  <option>Roboto</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Body Font</label>
                <select className="w-full h-10 px-3 rounded-md border border-gray-200">
                  <option>Inter</option>
                  <option>Open Sans</option>
                  <option>Roboto</option>
                  <option>Lato</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Page Title</label>
            <Input 
              defaultValue="CashSupportShipment - Smart Logistics, Seamless Deliveries"
              className="h-12"
            />
            <p className="text-xs text-gray-500">Recommended length: 50-60 characters</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Meta Description</label>
            <Textarea 
              defaultValue="Manage, track, and optimize your shipments with real-time precision. The ultimate multi-tenant platform for seamless shipment tracking and logistics management."
              rows={3}
            />
            <p className="text-xs text-gray-500">Recommended length: 150-160 characters</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Keywords</label>
            <Input 
              defaultValue="logistics, shipment tracking, delivery management, shipping platform"
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">OG Image URL</label>
            <Input 
              defaultValue="https://cashsupportshipment.com/og-image.jpg"
              className="h-12"
            />
          </div>
        </div>
      )}

      {/* Media Tab */}
      {activeTab === 'media' && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-display font-semibold text-navy-950 mb-6">Website Images</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Logo', path: '/logo.png', size: '512x512' },
              { name: 'Hero Dashboard', path: '/hero-dashboard.jpg', size: '1200x800' },
              { name: 'Step 1 - Account', path: '/step1-account.jpg', size: '800x600' },
              { name: 'Step 2 - Fleet', path: '/step2-fleet.jpg', size: '800x600' },
              { name: 'Step 3 - Track', path: '/step3-track.jpg', size: '800x600' },
            ].map((image) => (
              <div key={image.name} className="border border-gray-200 rounded-xl p-4">
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <Image className="w-8 h-8 text-gray-400" />
                </div>
                <p className="font-medium text-navy-950">{image.name}</p>
                <p className="text-sm text-gray-500">{image.size}</p>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    Replace
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Preview
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ContentSectionCard({
  section,
  onEdit,
  onSave,
}: {
  section: ContentSection;
  onEdit: (id: string) => void;
  onSave: (id: string, title: string, content: string) => void;
}) {
  const [editTitle, setEditTitle] = useState(section.title);
  const [editContent, setEditContent] = useState(section.content);

  const handleSave = () => {
    onSave(section.id, editTitle, editContent);
  };

  const handleCancel = () => {
    setEditTitle(section.title);
    setEditContent(section.content);
    onSave(section.id, section.title, section.content);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-navy-950">{section.name}</h3>
        {!section.isEditing && (
          <Button variant="outline" size="sm" onClick={() => onEdit(section.id)}>
            Edit
          </Button>
        )}
      </div>

      {section.isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Title</label>
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="h-12"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Content</label>
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              className="bg-gradient-brand text-white"
              onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <p className="font-medium text-lg text-navy-950">{section.title}</p>
          <p className="text-gray-600 mt-2">{section.content}</p>
        </div>
      )}
    </div>
  );
}
