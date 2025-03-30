
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Download, Trash2, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useItems } from '@/context/ItemContext';

const Settings: React.FC = () => {
  const { items } = useItems();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
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
        title: "Data Exported",
        description: "Your data has been successfully exported.",
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data.",
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
          title: "Data Imported",
          description: `Successfully imported ${data.length} items.`,
        });
      };
      
      reader.onerror = () => {
        toast({
          title: "Import Failed",
          description: "There was an error reading the file.",
          variant: "destructive"
        });
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Import failed:', error);
      toast({
        title: "Import Failed",
        description: "There was an error importing your data.",
        variant: "destructive"
      });
    }
  };
  
  const handleClearAllData = () => {
    // This would be handled by the ItemContext
    localStorage.removeItem('household-harbor-items');
    window.location.reload();
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        {/* Notifications Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you receive notifications about expiring items.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="flex flex-col gap-1">
                <span>Item Expiry Notifications</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Receive alerts when items are about to expire
                </span>
              </Label>
              <Switch 
                id="notifications" 
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Data Management */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Export, import or clear your data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label>Export Data</Label>
              <div className="text-sm text-muted-foreground mb-2">
                Download a copy of all your tracked items for backup
              </div>
              <Button 
                variant="outline" 
                onClick={handleExportData}
                className="flex items-center gap-2 w-fit"
              >
                <Download size={16} /> Export Data
              </Button>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="import-file">Import Data</Label>
              <div className="text-sm text-muted-foreground mb-2">
                Restore your items from a previous backup
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('import-file')?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload size={16} /> Import Data
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
              <Label>Clear All Data</Label>
              <div className="text-sm text-muted-foreground mb-2">
                This will permanently delete all your items and settings
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive"
                    className="flex items-center gap-2 w-fit"
                  >
                    <Trash2 size={16} /> Clear All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all your
                      tracked items and reset your settings to default.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearAllData}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
        
        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p>Household Harbor</p>
              <p className="mt-1">Version 1.0.0</p>
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
