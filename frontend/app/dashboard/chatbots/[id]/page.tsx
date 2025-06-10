'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FadeInUp, HoverCard } from '@/components/ui/motion';
import { 
  Bot, 
  ArrowLeft, 
  Upload, 
  Link,
  MessageSquare, 
  Send,
  Copy,
  Download,
  BarChart3,
  Settings,
  Globe,
  Code,
  Activity,
  Clock
} from 'lucide-react';
import Link_Component from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getChatbot, uploadData, queryChatbot, getAnalytics } from '@/lib/api';
import { Chatbot, Analytics } from '@/lib/types';

export default function ChatbotDetailPage() {
  const params = useParams();
  const router = useRouter();
  const chatbotId = parseInt(params.id as string);
  
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [querying, setQuerying] = useState(false);
  
  // Chat interface state
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{question: string, answer: string, timestamp: string}>>([]);
  
  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState('');
  
  const [activeTab, setActiveTab] = useState<'chat' | 'upload' | 'analytics' | 'embed'>('chat');
  const [embedFormat, setEmbedFormat] = useState<'jsx' | 'html'>('jsx');

  useEffect(() => {
    loadChatbotData();
  }, [chatbotId]);

  const loadChatbotData = async () => {
    try {
      setLoading(true);
      const [chatbotData, analyticsData] = await Promise.all([
        getChatbot(chatbotId),
        getAnalytics(1, chatbotId) // Using user_id = 1 for demo
      ]);
      
      setChatbot(chatbotData);
      setAnalytics(analyticsData);
      setChatHistory(analyticsData.slice(-10)); // Show last 10 conversations
    } catch (error) {
      console.error('Error loading chatbot data:', error);
      toast.error('Failed to load chatbot data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile && !websiteUrl) {
      toast.error('Please select a file or enter a website URL');
      return;
    }

    try {
      setUploading(true);
      await uploadData(1, chatbotId, uploadFile, websiteUrl); // Using user_id = 1 for demo
      toast.success('Data uploaded successfully!');
      setUploadFile(null);
      setWebsiteUrl('');
      loadChatbotData(); // Refresh data
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload data');
    } finally {
      setUploading(false);
    }
  };

  const handleQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      setQuerying(true);
      const response = await queryChatbot(1, chatbotId, question); // Using user_id = 1 for demo
      
      const newEntry = {
        question,
        answer: response.answer,
        timestamp: new Date().toISOString()
      };
      
      setChatHistory(prev => [...prev, newEntry]);
      setQuestion('');
      toast.success('Question answered!');
    } catch (error) {
      console.error('Query error:', error);
      toast.error('Failed to get answer');
    } finally {
      setQuerying(false);
    }
  };

  const copyEmbedCode = (type: 'widget' | 'inline' = 'widget', format: 'html' | 'jsx' = 'jsx') => {
    let embedCode = '';
    
    if (type === 'widget') {
      embedCode = format === 'jsx' 
        ? `<iframe 
  src="http://localhost:3000/widget/${chatbotId}" 
  style={{
    position: 'fixed', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%', 
    border: 'none',  
    zIndex: 2147483647
  }}
/>`
        : `<iframe src="http://localhost:3000/widget/${chatbotId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; border: none; pointer-events: none; z-index: 2147483647;"></iframe>`;
    } else {
      embedCode = format === 'jsx'
        ? `<iframe 
  src="http://localhost:3000/embed/${chatbotId}" 
  width="400" 
  height="600" 
  style={{ border: 'none' }}
/>`
        : `<iframe src="http://localhost:3000/embed/${chatbotId}" width="400" height="600" frameborder="0"></iframe>`;
    }
    navigator.clipboard.writeText(embedCode);
    toast.success('Embed code copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!chatbot) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <FadeInUp>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bot className="h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Chatbot not found</h3>
              <p className="text-slate-600 mb-6">The chatbot you're looking for doesn't exist.</p>
              <Link_Component href="/dashboard/chatbots">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Chatbots
                </Button>
              </Link_Component>
            </CardContent>
          </Card>
        </FadeInUp>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <FadeInUp>
          <div className="flex items-center space-x-4 mb-6">
            <Link_Component href="/dashboard/chatbots">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chatbots
              </Button>
            </Link_Component>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Bot className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{chatbot.name}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant={chatbot.status === 'active' ? 'default' : 'secondary'}>
                    {chatbot.status}
                  </Badge>
                  <span className="text-slate-600">{analytics.length} conversations</span>
                  <span className="text-slate-600">Created {new Date(chatbot.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => copyEmbedCode('widget', 'jsx')}>
                <Code className="h-4 w-4 mr-2" />
                Get Widget Code
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </FadeInUp>
      </div>

      {/* Tab Navigation */}
      <FadeInUp delay={0.1}>
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg mb-8 w-fit">
          {[
            { id: 'chat', label: 'Chat', icon: MessageSquare },
            { id: 'upload', label: 'Upload Data', icon: Upload },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'embed', label: 'Embed', icon: Globe }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </FadeInUp>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === 'chat' && (
            <FadeInUp delay={0.2}>
              <Card>
                <CardHeader>
                  <CardTitle>Test Your Chatbot</CardTitle>
                  <CardDescription>
                    Ask questions to see how your chatbot responds
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Chat History */}
                  <div className="h-96 overflow-y-auto bg-slate-50 rounded-lg p-4 mb-4 space-y-4">
                    {chatHistory.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-500">
                        <MessageSquare className="h-8 w-8 mb-2" />
                        <p>No conversations yet. Ask your first question!</p>
                      </div>
                    ) : (
                      chatHistory.map((chat, index) => (
                        <div key={index} className="space-y-2">
                          <div className="bg-blue-100 rounded-lg p-3 ml-8">
                            <p className="text-slate-900 font-medium">You</p>
                            <p className="text-slate-700">{chat.question}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 mr-8 border">
                            <p className="text-slate-900 font-medium flex items-center">
                              <Bot className="h-4 w-4 mr-2 text-blue-600" />
                              {chatbot.name}
                            </p>
                            <p className="text-slate-700">{chat.answer}</p>
                            <p className="text-xs text-slate-500 mt-2">
                              {new Date(chat.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Chat Input */}
                  <form onSubmit={handleQuestion} className="flex space-x-2">
                    <Input
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask a question..."
                      className="flex-1"
                      disabled={querying}
                    />
                    <Button type="submit" disabled={querying || !question.trim()}>
                      {querying ? (
                        <Activity className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </FadeInUp>
          )}

          {activeTab === 'upload' && (
            <FadeInUp delay={0.2}>
              <Card>
                <CardHeader>
                  <CardTitle>Upload Training Data</CardTitle>
                  <CardDescription>
                    Upload PDFs or add website URLs to train your chatbot
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="file">Upload PDF Document</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      className="text-base"
                    />
                    <p className="text-sm text-slate-500">
                      Upload PDF files to train your chatbot with document content
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex-1 h-px bg-slate-200"></div>
                    <span className="text-sm text-slate-500">OR</span>
                    <div className="flex-1 h-px bg-slate-200"></div>
                  </div>

                  {/* Website URL */}
                  <div className="space-y-2">
                    <Label htmlFor="website">Website URL</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://example.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="text-base"
                    />
                    <p className="text-sm text-slate-500">
                      Add a website URL to scrape and train your chatbot
                    </p>
                  </div>

                  <Button 
                    onClick={handleFileUpload} 
                    disabled={uploading || (!uploadFile && !websiteUrl)}
                    className="w-full"
                  >
                    {uploading ? (
                      <>
                        <Activity className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Data
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </FadeInUp>
          )}

          {activeTab === 'analytics' && (
            <FadeInUp delay={0.2}>
              <Card>
                <CardHeader>
                  <CardTitle>Conversation Analytics</CardTitle>
                  <CardDescription>
                    View all conversations and responses from your chatbot
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                        <BarChart3 className="h-8 w-8 mb-2" />
                        <p>No analytics data yet</p>
                        <p className="text-sm">Start chatting to see analytics</p>
                      </div>
                    ) : (
                      analytics.map((item, index) => (
                        <div key={index} className="border border-slate-200 rounded-lg p-4">
                          <div className="space-y-3">
                            <div>
                              <p className="font-medium text-slate-900">Question:</p>
                              <p className="text-slate-700">{item.question}</p>
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">Answer:</p>
                              <p className="text-slate-700">{item.answer}</p>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-slate-500">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(item.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </FadeInUp>
          )}

          {activeTab === 'embed' && (
            <FadeInUp delay={0.2}>
              <Card>
                <CardHeader>
                  <CardTitle>Embed Your Chatbot</CardTitle>
                  <CardDescription>
                    Choose how you want to embed your chatbot on any website
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Format Toggle */}
                  <div className="flex items-center justify-center space-x-1 bg-slate-100 p-1 rounded-lg w-fit mx-auto">
                    <button
                      onClick={() => setEmbedFormat('jsx')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        embedFormat === 'jsx'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      React/JSX
                    </button>
                    <button
                      onClick={() => setEmbedFormat('html')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        embedFormat === 'html'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      HTML
                    </button>
                  </div>

                  {/* Widget Option */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">Floating Chat Widget (Recommended)</Label>
                      <Badge variant="secondary">Popular</Badge>
                    </div>
                    <p className="text-sm text-slate-600">
                      Adds a floating chat button in the bottom right corner. Perfect for React layout.jsx files.
                    </p>
                    <div className="relative">
                      <Textarea
                        readOnly
                        value={embedFormat === 'jsx' 
                          ? `<iframe 
  src="http://localhost:3000/widget/${chatbotId}" 
  style={{
    position: 'fixed', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%', 
    border: 'none', 
    zIndex: 2147483647
  }}
/>`
                          : `<iframe src="http://localhost:3000/widget/${chatbotId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; border: none; pointer-events: none; z-index: 2147483647;"></iframe>`
                        }
                        className="font-mono text-sm"
                        rows={embedFormat === 'jsx' ? 11 : 3}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2"
                        onClick={() => copyEmbedCode('widget', embedFormat)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy Widget Code
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex-1 h-px bg-slate-200"></div>
                    <span className="text-sm text-slate-500">OR</span>
                    <div className="flex-1 h-px bg-slate-200"></div>
                  </div>

                  {/* Inline Option */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Inline Chat</Label>
                    <p className="text-sm text-slate-600">
                      Embeds the chatbot directly into your webpage as a fixed-size element.
                    </p>
                    <div className="relative">
                      <Textarea
                        readOnly
                        value={embedFormat === 'jsx'
                          ? `<iframe 
  src="http://localhost:3000/embed/${chatbotId}" 
  width="400" 
  height="600" 
  style={{ border: 'none' }}
/>`
                          : `<iframe src="http://localhost:3000/embed/${chatbotId}" width="400" height="600" frameborder="0"></iframe>`
                        }
                        className="font-mono text-sm"
                        rows={embedFormat === 'jsx' ? 6 : 3}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2"
                        onClick={() => copyEmbedCode('inline', embedFormat)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy Inline Code
                      </Button>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Integration Instructions</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                      <li>Copy the embed code above</li>
                      <li>Paste it into your website's HTML</li>
                      <li>Customize the width and height as needed</li>
                      <li>Your chatbot will appear as an interactive widget</li>
                    </ol>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-900">Customization Options</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Width</Label>
                        <Input defaultValue="400" placeholder="400px" />
                      </div>
                      <div>
                        <Label>Height</Label>
                        <Input defaultValue="600" placeholder="600px" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeInUp>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <FadeInUp delay={0.3}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Total Questions</span>
                  <span className="font-medium">{analytics.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Status</span>
                  <Badge variant={chatbot.status === 'active' ? 'default' : 'secondary'}>
                    {chatbot.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Created</span>
                  <span className="font-medium">{new Date(chatbot.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Last Activity</span>
                  <span className="font-medium">
                    {analytics.length > 0 
                      ? new Date(analytics[analytics.length - 1].timestamp).toLocaleDateString()
                      : 'Never'
                    }
                  </span>
                </div>
              </CardContent>
            </Card>
          </FadeInUp>

          <FadeInUp delay={0.4}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={copyEmbedCode}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Embed Code
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="h-4 w-4 mr-2" />
                  View Live Demo
                </Button>
              </CardContent>
            </Card>
          </FadeInUp>
        </div>
      </div>
    </div>
  );
}