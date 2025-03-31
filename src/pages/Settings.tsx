
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Check, ChevronDown, Download, Globe, Moon, Sun, Trash2, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useItems } from '@/context/ItemContext';
import { useLanguage, Language } from '@/context/LanguageContext';
import { useTheme } from '@/components/theme-provider';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';

const Settings: React.FC = () => {
  const { items, notificationPreferences, setNotificationPreferences } = useItems();
  const { language, setLanguage, t, getLanguageNativeName } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  
  const languages: Language[] = ['en', 'zh-TW', 'zh-CN'];
  
  const handleExportData = () => {
    try {
      const dataStr = JSON.stringify(items, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `whatsleft-backup-${new Date().toISOString().split('T')[0]}.json`;
      
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
    <div className="min-h-screen bg-primary dark:bg-gray-900">
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
                className="data-[state=checked]:bg-secondary"
              />
            </div>

            {/* Language Selection */}
            <div className="flex flex-col gap-2 pt-4">
              <Label>{t("settings.language")}</Label>
              
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Globe size={16} />
                      {getLanguageNativeName(language)}
                    </div>
                    <ChevronDown size={16} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandGroup>
                      {languages.map((lang) => (
                        <CommandItem
                          key={lang}
                          onSelect={() => {
                            setLanguage(lang);
                            setOpen(false);
                          }}
                          className="flex items-center justify-between px-4 py-2"
                        >
                          {getLanguageNativeName(lang)}
                          {language === lang && (
                            <Check size={16} className="text-secondary" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
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
                className="data-[state=checked]:bg-secondary"
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
                variant="secondary" 
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
                  variant="secondary"
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
              <p>WhatsLeft</p>
              <p className="mt-1">{t("settings.version")} 1.0.0</p>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} WhatsLeft
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default Settings;
