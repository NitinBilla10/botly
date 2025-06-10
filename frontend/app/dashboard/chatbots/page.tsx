'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FadeInUp, HoverCard } from '@/components/ui/motion';
import { 
  Bot, 
  Plus, 
  Search, 
  Eye, 
  Settings, 
  Copy, 
  MoreVertical,
  Activity,
  Calendar,
  Loader2,
  Trash2
} from 'lucide-react';
import { getChatbots, deleteChatbot, type Chatbot } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export default function ChatbotsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchChatbots();
  }, [user?.id]);

  const fetchChatbots = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getChatbots();
      setChatbots(data);
    } catch (err) {
      console.error('Error fetching chatbots:', err);
      setError('Failed to load chatbots');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChatbot = async (chatbotId: number) => {
    try {
      setDeletingId(chatbotId);
      await deleteChatbot(chatbotId);
      setChatbots(prev => prev.filter(bot => bot.id !== chatbotId));
      toast.success('Chatbot deleted successfully');
    } catch (error) {
      console.error('Error deleting chatbot:', error);
      toast.error('Failed to delete chatbot');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredChatbots = chatbots.filter(chatbot => {
    const matchesSearch = chatbot.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || chatbot.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const copyEmbedCode = (chatbotId: number) => {
    const embedCode = `<iframe src="https://botly.example.com/embed/${chatbotId}" width="400" height="600" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    toast.success('Embed code copied to clipboard!');
  };

  return (
    <ProtectedRoute>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <FadeInUp>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Chatbots</h1>
                <p className="text-slate-600 mt-2">Manage all your AI chatbots in one place</p>
              </div>
              <Link href="/dashboard/chatbots/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Chatbot
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>

        {/* Search and Filters */}
        <FadeInUp delay={0.1}>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search chatbots..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={statusFilter === 'all' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setStatusFilter('all')}
                  >
                    All Status
                  </Button>
                  <Button 
                    variant={statusFilter === 'active' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setStatusFilter('active')}
                  >
                    Active
                  </Button>
                  <Button 
                    variant={statusFilter === 'inactive' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setStatusFilter('inactive')}
                  >
                    Inactive
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeInUp>

        {/* Loading State */}
        {loading && (
          <FadeInUp delay={0.2}>
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-slate-600">Loading chatbots...</span>
            </div>
          </FadeInUp>
        )}

        {/* Error State */}
        {error && !loading && (
          <FadeInUp delay={0.2}>
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchChatbots} variant="outline">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </FadeInUp>
        )}

        {/* Chatbots Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChatbots.map((chatbot, index) => (
              <FadeInUp key={chatbot.id} delay={index * 0.1}>
                <HoverCard>
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Bot className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{chatbot.name}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={chatbot.status === 'active' ? 'default' : 'secondary'}>
                                {chatbot.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => copyEmbedCode(chatbot.id)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy Embed Code
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteChatbot(chatbot.id)}
                              className="text-red-600"
                              disabled={deletingId === chatbot.id}
                            >
                              {deletingId === chatbot.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="mr-2 h-4 w-4" />
                              )}
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Created</span>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            <span className="font-medium">{new Date(chatbot.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Status</span>
                          <div className="flex items-center space-x-1">
                            <Activity className={`h-3 w-3 ${chatbot.status === 'active' ? 'text-green-500' : 'text-slate-400'}`} />
                            <span className="font-medium capitalize">{chatbot.status}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">User ID</span>
                          <span className="font-medium">{chatbot.user_id}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-6">
                        <Link href={`/dashboard/chatbots/${chatbot.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyEmbedCode(chatbot.id)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </HoverCard>
              </FadeInUp>
            ))}

            {/* Empty State */}
            {filteredChatbots.length === 0 && !loading && !error && (
              <FadeInUp>
                <Card className="col-span-full">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Bot className="h-12 w-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {searchTerm || statusFilter !== 'all' ? 'No chatbots found' : 'No chatbots yet'}
                    </h3>
                    <p className="text-slate-600 text-center mb-6">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search terms or filters' 
                        : 'Get started by creating your first chatbot'
                      }
                    </p>
                    <Link href="/dashboard/chatbots/new">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Chatbot
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </FadeInUp>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}