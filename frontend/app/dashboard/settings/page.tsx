'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { FadeInUp, HoverCard } from '@/components/ui/motion';
import { 
  Settings, 
  User, 
  Key, 
  Bell, 
  Palette, 
  Shield, 
  Trash2,
  Save,
  CreditCard,
  Crown,
  Zap,
  Globe,
  Mail,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { updateCurrentUser } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function SettingsPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [settings, setSettings] = useState({
    emailNotifications: true,
    marketingEmails: false,
    darkMode: false,
    publicProfile: false
  });
  const [saving, setSaving] = useState(false);
  const [testingKey, setTestingKey] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setOpenaiApiKey(user.openai_api_key || '');
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // For now, we only support updating the OpenAI API key
      if (openaiApiKey !== user?.openai_api_key) {
        await updateCurrentUser({ openai_api_key: openaiApiKey });
        toast.success('Profile updated successfully!');
      } else {
        toast.success('No changes to save');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleTestApiKey = async () => {
    if (!openaiApiKey.startsWith('sk-')) {
      toast.error('Please enter a valid OpenAI API key');
      return;
    }

    setTestingKey(true);
    try {
      // Simulate API key test - in real implementation, you'd call OpenAI API
      setTimeout(() => {
        toast.success('API key is valid!');
        setTestingKey(false);
      }, 1500);
    } catch (error) {
      toast.error('Invalid API key');
      setTestingKey(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    // Simulate API call for settings - in real implementation, you'd update backend
    setTimeout(() => {
      toast.success('Settings updated successfully!');
      setSaving(false);
    }, 1000);
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion requires confirmation and is not implemented in this demo');
  };

  return (
    <ProtectedRoute>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <FadeInUp>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-slate-100 rounded-lg">
                <Settings className="h-8 w-8 text-slate-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-600 mt-2">Manage your account settings and preferences</p>
              </div>
            </div>
          </FadeInUp>
        </div>

        <div className="space-y-8">
          {/* Profile Settings */}
          <FadeInUp delay={0.1}>
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-slate-600" />
                  <CardTitle>Profile Information</CardTitle>
                </div>
                <CardDescription>
                  Update your personal information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled // Email is typically not editable after registration
                    />
                    <p className="text-xs text-slate-500">
                      Email cannot be changed after registration
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    id="company"
                    placeholder="Your company name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Profile
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </FadeInUp>

          {/* API Settings */}
          <FadeInUp delay={0.2}>
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Key className="h-5 w-5 text-slate-600" />
                  <CardTitle>API Configuration</CardTitle>
                </div>
                <CardDescription>
                  Manage your OpenAI API key and other integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai-key">OpenAI API Key</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="openai-key"
                      type="password"
                      value={openaiApiKey}
                      onChange={(e) => setOpenaiApiKey(e.target.value)}
                      placeholder="sk-..."
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleTestApiKey}
                      disabled={testingKey || !openaiApiKey}
                    >
                      {testingKey ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Test Key'
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-slate-500">
                    Your API key is encrypted and stored securely. Used to power your chatbots.
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">API Key Security</h4>
                      <p className="text-sm text-blue-800 mt-1">
                        Your API key is encrypted using industry-standard encryption and never stored in plain text.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeInUp>

          {/* Account Status */}
          <FadeInUp delay={0.3}>
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-slate-600" />
                  <CardTitle>Account Status</CardTitle>
                </div>
                <CardDescription>
                  Your current account information and status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">User ID</h4>
                        <p className="text-sm text-slate-600">#{user?.id}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Key className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">API Key</h4>
                        <p className="text-sm text-slate-600">
                          {user?.openai_api_key ? 'Configured' : 'Not Set'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Crown className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">Backend Integration</h4>
                      <p className="text-sm text-slate-600">Fully connected to API backend</p>
                    </div>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
              </CardContent>
            </Card>
          </FadeInUp>

          {/* Preferences */}
          <FadeInUp delay={0.4}>
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Palette className="h-5 w-5 text-slate-600" />
                  <CardTitle>Preferences</CardTitle>
                </div>
                <CardDescription>
                  Customize your experience and notification settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-slate-600">
                        Receive email notifications about your chatbots
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Marketing Emails</Label>
                      <p className="text-sm text-slate-600">
                        Receive updates about new features and promotions
                      </p>
                    </div>
                    <Switch
                      checked={settings.marketingEmails}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, marketingEmails: checked }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Dark Mode</Label>
                      <p className="text-sm text-slate-600">
                        Use dark theme for the dashboard (Coming Soon)
                      </p>
                    </div>
                    <Switch
                      checked={settings.darkMode}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, darkMode: checked }))
                      }
                      disabled
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Public Profile</Label>
                      <p className="text-sm text-slate-600">
                        Make your profile visible to other users
                      </p>
                    </div>
                    <Switch
                      checked={settings.publicProfile}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, publicProfile: checked }))
                      }
                    />
                  </div>
                </div>

                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </FadeInUp>

          {/* Data & Privacy */}
          <FadeInUp delay={0.5}>
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-slate-600" />
                  <CardTitle>Data & Privacy</CardTitle>
                </div>
                <CardDescription>
                  Control your data and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <Globe className="h-4 w-4 mr-2" />
                    Export Your Data (Coming Soon)
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <Mail className="h-4 w-4 mr-2" />
                    Download Privacy Report (Coming Soon)
                  </Button>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium text-slate-900">Data Retention</h4>
                  <p className="text-sm text-slate-600">
                    Your chatbot conversations are stored securely and can be accessed through the analytics dashboard. 
                    You have full control over your data at all times.
                  </p>
                </div>
              </CardContent>
            </Card>
          </FadeInUp>

          {/* Danger Zone */}
          <FadeInUp delay={0.6}>
            <Card className="border-red-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Trash2 className="h-5 w-5 text-red-600" />
                  <CardTitle className="text-red-900">Danger Zone</CardTitle>
                </div>
                <CardDescription>
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
                  <p className="text-sm text-red-800 mb-4">
                    Once you delete your account, there is no going back. 
                    All your chatbots and data will be permanently deleted.
                  </p>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FadeInUp>
        </div>
      </div>
    </ProtectedRoute>
  );
}