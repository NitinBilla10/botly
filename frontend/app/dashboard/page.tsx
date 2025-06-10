'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FadeInUp, HoverCard } from '@/components/ui/motion';
import { 
  Bot, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Plus,
  Activity,
  Eye,
  Clock,
  Zap,
  Target,
  Loader2
} from 'lucide-react';
import { getChatbots, type Chatbot } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChatbots() {
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
    }

    if (user) {
      fetchChatbots();
    }
  }, [user?.id]);

  // Calculate stats from real data
  const stats = [
    {
      title: 'Total Chatbots',
      value: chatbots.length,
      change: `${chatbots.filter(bot => bot.has_data).length} trained`,
      icon: Bot,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Conversations',
      value: '---', // This would come from analytics
      change: 'Connect to see data',
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Response Rate',
      value: '---',
      change: 'Connect to see data',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Status',
      value: user ? 'Connected' : 'Disconnected',
      change: 'Backend integration active',
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <ProtectedRoute>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <FadeInUp>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-600 mt-2">
                  Welcome back{user?.email ? `, ${user.email}` : ''}! Here's what's happening with your chatbots.
                </p>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <FadeInUp key={stat.title} delay={index * 0.1}>
              <HoverCard>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <p className="text-xs text-slate-600 mt-1">{stat.change}</p>
                  </CardContent>
                </Card>
              </HoverCard>
            </FadeInUp>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Chatbots */}
          <FadeInUp delay={0.2}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Chatbots</CardTitle>
                    <CardDescription>Manage and monitor your active chatbots</CardDescription>
                  </div>
                  <Link href="/dashboard/chatbots">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-slate-600">Loading chatbots...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-600">{error}</p>
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.reload()}
                      className="mt-2"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : chatbots.length === 0 ? (
                  <div className="text-center py-8">
                    <Bot className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">No chatbots yet</p>
                    <Link href="/dashboard/chatbots/new">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Chatbot
                      </Button>
                    </Link>
                  </div>
                ) : (
                  chatbots.slice(0, 4).map((chatbot) => (
                    <div key={chatbot.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${chatbot.has_data ? 'bg-green-100' : 'bg-yellow-100'}`}>
                          <Bot className={`h-4 w-4 ${chatbot.has_data ? 'text-green-600' : 'text-yellow-600'}`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{chatbot.name}</h4>
                          <p className="text-sm text-slate-600">
                            {chatbot.has_data 
                              ? `Trained with ${chatbot.data_type === 'file' ? 'PDF' : 'website'} • ${new Date(chatbot.createdAt).toLocaleDateString()}`
                              : `Needs training • Created ${new Date(chatbot.createdAt).toLocaleDateString()}`
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={chatbot.has_data ? 'default' : 'secondary'}>
                          {chatbot.has_data ? 'Trained' : 'Needs Training'}
                        </Badge>
                        <Link href={chatbot.has_data ? `/dashboard/chatbots/${chatbot.id}` : `/dashboard/chatbots/${chatbot.id}/train`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </FadeInUp>

          {/* Recent Activity */}
          <FadeInUp delay={0.3}>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your chatbots</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {chatbots.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">No activity yet</p>
                    <p className="text-sm text-slate-500">Activity will appear here once you create chatbots</p>
                  </div>
                ) : (
                  chatbots.slice(0, 5).map((chatbot, index) => (
                    <div key={chatbot.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="p-1.5 bg-blue-100 rounded-full">
                          <Bot className="h-3 w-3 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900">Chatbot "{chatbot.name}" was created</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-slate-500">System</p>
                          <span className="text-xs text-slate-400">•</span>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-slate-400" />
                            <p className="text-xs text-slate-500">{new Date(chatbot.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </FadeInUp>
        </div>

        {/* Performance Insights */}
        <FadeInUp delay={0.4}>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>Key metrics and recommendations for your chatbots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-900">Connected</div>
                  <p className="text-sm text-green-700">Backend Integration</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-900">{chatbots.length}</div>
                  <p className="text-sm text-blue-700">Active Chatbots</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-900">Ready</div>
                  <p className="text-sm text-purple-700">System Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeInUp>

        {/* Quick Actions */}
        <FadeInUp delay={0.5}>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks to get you started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Link href="/dashboard/chatbots/new">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 w-full">
                    <Plus className="h-6 w-6" />
                    <span>Create New Chatbot</span>
                  </Button>
                </Link>
                <Link href="/dashboard/chatbots">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 w-full">
                    <Bot className="h-6 w-6" />
                    <span>Manage Chatbots</span>
                  </Button>
                </Link>
                <Link href="/dashboard/settings">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 w-full">
                    <TrendingUp className="h-6 w-6" />
                    <span>View Analytics</span>
                  </Button>
                </Link>
                <Link href="/dashboard/settings">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 w-full">
                    <Users className="h-6 w-6" />
                    <span>Account Settings</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </FadeInUp>
      </div>
    </ProtectedRoute>
  );
}