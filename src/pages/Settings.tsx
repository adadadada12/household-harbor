
import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Download, Globe, Moon, Sun, Trash2, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useItems } from '@/context/ItemContext';
import { useLanguage, Language } from '@/context/LanguageContext';
import { useTheme } from '@/components/theme-provider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';

const Settings: React.FC = () => {
  const { items, notificationPreferences, setNotificationPreferences } = useItems();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  
  const handleExportData = () => {
    try {
      const dataStr = JSON.stringify(items, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `household-harbor-backup-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: t("toast.dataExported"),
        description: t("toast.dataExported"),
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: t("toast.exportFailed"),
        description: t("toast.exportFailed"),
        variant: "destructive"
      });
    }
  };
  
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Here you would process the imported data
        // For now we'll just show a success message
        toast({
          title: t("toast.dataImported").replace('{count}', String(data.length)),
          description: t("toast.dataImported").replace('{count}', String(data.length)),
        });
      };
      
      reader.onerror = () => {
        toast({
          title: t("toast.importFailed"),
          description: t("toast.importFailed"),
          variant: "destructive"
        });
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Import failed:', error);
      toast({
        title: t("toast.importFailed"),
        description: t("toast.importFailed"),
        variant: "destructive"
      });
    }
  };
  
  const handleClearAllData = () => {
    localStorage.removeItem('household-harbor-items');
    window.location.reload();
  };

  const handleNotificationToggle = (enabled: boolean) => {
    setNotificationPreferences({ ...notificationPreferences, enabled });
  };

  const handleDaysChange = (days: number[]) => {
    setNotificationPreferences({ ...notificationPreferences, daysBeforeExpiry: days[0] });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 pb-28">
        <h1 className="text-2xl font-bold mb-6">{t("settings.title")}</h1>
        
        {/* Appearance Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t("settings.appearance")}</CardTitle>
            <CardDescription>Customize how the application looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode" className="flex flex-col gap-1">
                <span>{t("settings.darkMode")}</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Switch between light and dark theme
                </span>
              </Label>
              <Switch 
                id="darkMode" 
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            {/* Language Selection */}
            <div className="flex flex-col gap-2 pt-4">
              <Label>{t("settings.language")}</Label>
              <RadioGroup 
                value={language} 
                onValueChange={(value) => setLanguage(value as Language)}
                className="flex flex-col gap-3 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="en" id="lang-en" />
                  <Label htmlFor="lang-en" className="flex items-center gap-2 cursor-pointer">
                    <Globe size={16} /> {t("settings.language.en")}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="zh-TW" id="lang-zh-tw" />
                  <Label htmlFor="lang-zh-tw" className="flex items-center gap-2 cursor-pointer">
                    <Globe size={16} /> {t("settings.language.zh-TW")}
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="zh-CN" id="lang-zh-cn" />
                  <Label htmlFor="lang-zh-cn" className="flex items-center gap-2 cursor-pointer">
                    <Globe size={16} /> {t("settings.language.zh-CN")}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
        
        {/* Notifications Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t("settings.notifications")}</CardTitle>
            <CardDescription>Configure how you receive notifications about expiring items</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="flex flex-col gap-1">
                <span>{t("settings.notifyBefore")}</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Receive alerts when items are about to expire
                </span>
              </Label>
              <Switch 
                id="notifications" 
                checked={notificationPreferences.enabled}
                onCheckedChange={handleNotificationToggle}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            
            {notificationPreferences.enabled && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{t("settings.notifyDays")}</Label>
                  <span className="font-medium">{notificationPreferences.daysBeforeExpiry} days</span>
                </div>
                <Slider 
                  value={[notificationPreferences.daysBeforeExpiry]} 
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={handleDaysChange}
                  className="py-4"
                />
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Data Management */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t("settings.data")}</CardTitle>
            <CardDescription>Export, import or clear your data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label>{t("settings.exportData")}</Label>
              <div className="text-sm text-muted-foreground mb-2">
                Download a copy of all your tracked items for backup
              </div>
              <Button 
                variant="outline" 
                onClick={handleExportData}
                className="flex items-center gap-2 w-fit"
              >
                <Download size={16} /> {t("settings.exportData")}
              </Button>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="import-file">{t("settings.importData")}</Label>
              <div className="text-sm text-muted-foreground mb-2">
                Restore your items from a previous backup
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('import-file')?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload size={16} /> {t("settings.importData")}
                </Button>
                <input
                  id="import-file"
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label>{t("settings.clearData")}</Label>
              <div className="text-sm text-muted-foreground mb-2">
                This will permanently delete all your items and settings
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive"
                    className="flex items-center gap-2 w-fit"
                  >
                    <Trash2 size={16} /> {t("settings.clearData")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("dialog.clearDataConfirm")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("dialog.clearDataDescription")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("dialog.cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearAllData}>{t("dialog.confirm")}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
        
        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.about")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p>Household Harbor</p>
              <p className="mt-1">{t("settings.version")} 1.0.0</p>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Household Harbor
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default Settings;
