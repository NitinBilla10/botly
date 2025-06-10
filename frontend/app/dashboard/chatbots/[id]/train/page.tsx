'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FadeInUp } from '@/components/ui/motion';
import { 
  ArrowLeft, 
  Upload, 
  Globe, 
  FileText, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  Bot,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getChatbot, uploadData } from '@/lib/api';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function TrainChatbotPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const chatbotId = parseInt(params.id as string);
  
  const [chatbot, setChatbot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploadType, setUploadType] = useState<'file' | 'website' | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [website, setWebsite] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchChatbot() {
      try {
        setLoading(true);
        const data = await getChatbot(chatbotId);
        setChatbot(data);
        
        // If bot already has data, show success state
        if (data.has_data) {
          setSuccess(true);
        }
      } catch (err) {
        console.error('Error fetching chatbot:', err);
        setError('Failed to load chatbot information');
      } finally {
        setLoading(false);
      }
    }

    if (chatbotId && user) {
      fetchChatbot();
    }
  }, [chatbotId, user]);

  const handleFileUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      await uploadData(user!.id, chatbotId, file);
      toast.success('File uploaded and chatbot trained successfully!');
      setSuccess(true);
      
      // Refresh chatbot data
      const updatedChatbot = await getChatbot(chatbotId);
      setChatbot(updatedChatbot);
    } catch (error: any) {
      console.error('Upload failed:', error);
      setError(error.message || 'Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleWebsiteUpload = async () => {
    if (!website.trim()) {
      setError('Please enter a website URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(website);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      await uploadData(user!.id, chatbotId, null, website);
      toast.success('Website crawled and chatbot trained successfully!');
      setSuccess(true);
      
      // Refresh chatbot data
      const updatedChatbot = await getChatbot(chatbotId);
      setChatbot(updatedChatbot);
    } catch (error: any) {
      console.error('Upload failed:', error);
      setError(error.message || 'Failed to crawl website. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRetrain = () => {
    setSuccess(false);
    setUploadType(null);
    setFile(null);
    setWebsite('');
    setError('');
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-slate-600">Loading chatbot...</span>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

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
                <h1 className="text-3xl font-bold text-slate-900">Train "{chatbot?.name}"</h1>
                <p className="text-slate-600 mt-2">
                  {success ? 'Your chatbot is ready! You can retrain it with new data anytime.' : 'Upload training data to make your chatbot intelligent'}
                </p>
              </div>
            </div>
          </FadeInUp>
        </div>

        {success ? (
          // Success State
          <FadeInUp>
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <CardTitle className="text-green-900">Chatbot Successfully Trained!</CardTitle>
                </div>
                <CardDescription className="text-green-700">
                  Your chatbot is now ready to answer questions based on the uploaded data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-slate-900 mb-2">Training Data:</h4>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Source:</span> {chatbot?.data_source}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Type:</span> {chatbot?.data_type === 'file' ? 'PDF Document' : 'Website'}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Last Updated:</span> {new Date(chatbot?.last_trained).toLocaleString()}
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <Link href={`/dashboard/chatbots/${chatbotId}`}>
                    <Button>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Test Chatbot
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={handleRetrain}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Data
                  </Button>
                  <Link href="/dashboard/chatbots">
                    <Button variant="ghost">
                      View All Chatbots
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </FadeInUp>
        ) : (
          <div className="space-y-8">
            {/* Upload Type Selection */}
            {!uploadType && (
              <FadeInUp>
                <Card>
                  <CardHeader>
                    <CardTitle>Choose Training Data Type</CardTitle>
                    <CardDescription>
                      Select how you want to train your chatbot
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => setUploadType('file')}
                        className="p-6 border-2 border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <h3 className="text-lg font-semibold text-slate-900">Upload PDF</h3>
                        </div>
                        <p className="text-slate-600">
                          Upload PDF documents, manuals, or any text-based files to train your chatbot.
                        </p>
                      </button>
                      
                      <button
                        onClick={() => setUploadType('website')}
                        className="p-6 border-2 border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <Globe className="h-8 w-8 text-blue-600" />
                          <h3 className="text-lg font-semibold text-slate-900">Crawl Website</h3>
                        </div>
                        <p className="text-slate-600">
                          Provide a website URL and we'll crawl all its pages to train your chatbot.
                        </p>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </FadeInUp>
            )}

            {/* File Upload */}
            {uploadType === 'file' && (
              <FadeInUp>
                <Card>
                  <CardHeader>
                    <CardTitle>Upload PDF File</CardTitle>
                    <CardDescription>
                      Select a PDF file to train your chatbot
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="file">PDF File</Label>
                      <Input
                        id="file"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        disabled={isUploading}
                      />
                      <p className="text-sm text-slate-500">
                        Supported format: PDF (max 10MB)
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        onClick={handleFileUpload} 
                        disabled={!file || isUploading}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading & Training...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload & Train
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setUploadType(null)}
                        disabled={isUploading}
                      >
                        Back
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </FadeInUp>
            )}

            {/* Website Crawl */}
            {uploadType === 'website' && (
              <FadeInUp>
                <Card>
                  <CardHeader>
                    <CardTitle>Crawl Website</CardTitle>
                    <CardDescription>
                      Enter a website URL to crawl and train your chatbot
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="website">Website URL</Label>
                      <Input
                        id="website"
                        type="url"
                        placeholder="https://example.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        disabled={isUploading}
                      />
                      <p className="text-sm text-slate-500">
                        We'll crawl all pages within the same domain (up to 50 pages)
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        onClick={handleWebsiteUpload} 
                        disabled={!website.trim() || isUploading}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Crawling & Training...
                          </>
                        ) : (
                          <>
                            <Globe className="h-4 w-4 mr-2" />
                            Crawl & Train
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setUploadType(null)}
                        disabled={isUploading}
                      >
                        Back
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </FadeInUp>
            )}

            {/* Info Card */}
            <FadeInUp delay={0.2}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">💡 Training Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium text-slate-900 mb-1">Quality over quantity</p>
                    <p className="text-slate-600">Better to have focused, relevant content than lots of unrelated information</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-slate-900 mb-1">Keep it updated</p>
                    <p className="text-slate-600">You can retrain your bot anytime with new data - old data will be replaced</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-slate-900 mb-1">Test after training</p>
                    <p className="text-slate-600">Ask your bot some questions to make sure it learned correctly</p>
                  </div>
                </CardContent>
              </Card>
            </FadeInUp>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 