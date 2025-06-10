'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FadeInUp } from '@/components/ui/motion';
import { ArrowLeft, Bot, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createChatbot } from '@/lib/api';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function NewChatbotPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    instructions: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name.trim()) {
      setError('Please enter a chatbot name');
      return;
    }

    if (!user) {
      setError('You must be logged in to create a chatbot');
      return;
    }

    setIsCreating(true);
    
    try {
      // Call the backend API to create the chatbot with all fields
      const result = await createChatbot({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        instructions: formData.instructions.trim() || undefined
      });
      
      toast.success(`Chatbot "${formData.name}" created successfully!`);
      
      // Redirect to the training page for the newly created chatbot
      router.push(`/dashboard/chatbots/${result.id}/train`);
    } catch (error: any) {
      console.error('Failed to create chatbot:', error);
      setError(error.message || 'Failed to create chatbot. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ProtectedRoute>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <FadeInUp>
            <div className="flex items-center space-x-4 mb-6">
              <Link href="/dashboard/chatbots">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Chatbots
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Bot className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Create New Chatbot</h1>
                <p className="text-slate-600 mt-2">Set up your AI assistant in just a few steps</p>
              </div>
            </div>
          </FadeInUp>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <FadeInUp delay={0.1}>
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Give your chatbot a name and describe what it should help with
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="name">Chatbot Name *</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Customer Support Bot"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="text-base"
                        disabled={isCreating}
                        maxLength={100}
                      />
                      <p className="text-sm text-slate-500">
                        Choose a descriptive name for your chatbot
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe what your chatbot will help users with..."
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={3}
                        className="text-base"
                        disabled={isCreating}
                        maxLength={500}
                      />
                      <p className="text-sm text-slate-500">
                        This helps your bot understand its role and helps you organize your chatbots
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instructions">Custom Instructions</Label>
                      <Textarea
                        id="instructions"
                        placeholder="Provide specific instructions for how your chatbot should respond..."
                        value={formData.instructions}
                        onChange={(e) => handleInputChange('instructions', e.target.value)}
                        rows={4}
                        className="text-base"
                        disabled={isCreating}
                        maxLength={1000}
                      />
                      <p className="text-sm text-slate-500">
                        Give your chatbot specific guidelines on tone, style, and behavior. This helps it understand who it is and how to respond.
                      </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button type="submit" disabled={isCreating} className="flex-1">
                        {isCreating ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Bot className="h-4 w-4 mr-2" />
                            Create & Train Chatbot
                          </>
                        )}
                      </Button>
                      <Link href="/dashboard/chatbots">
                        <Button type="button" variant="outline" disabled={isCreating}>
                          Cancel
                        </Button>
                      </Link>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </FadeInUp>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <FadeInUp delay={0.2}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What's Next?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Create chatbot</p>
                      <p className="text-sm text-slate-600">Set up basic information and personality</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-slate-600">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Upload training data</p>
                      <p className="text-sm text-slate-600">Add PDFs or website URLs to train your bot</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-slate-600">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Test and deploy</p>
                      <p className="text-sm text-slate-600">Test your bot and embed it on your website</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeInUp>

            <FadeInUp delay={0.3}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">💡 Tips for Better Chatbots</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium text-slate-900 mb-1">Be specific with descriptions</p>
                    <p className="text-slate-600">Tell your bot exactly what it's supposed to help with</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-slate-900 mb-1">Set clear instructions</p>
                    <p className="text-slate-600">Define the tone, style, and behavior you want</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-slate-900 mb-1">Example instructions</p>
                    <p className="text-slate-600 italic">"Be friendly and helpful. Always ask follow-up questions if unclear. Keep responses concise."</p>
                  </div>
                </CardContent>
              </Card>
            </FadeInUp>

            {/* User Info */}
            <FadeInUp delay={0.4}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Email:</span> {user?.email}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">API Key:</span> {user?.openai_api_key ? 'Configured ✓' : 'Not set'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeInUp>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}