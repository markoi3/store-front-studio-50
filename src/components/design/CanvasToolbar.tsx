
import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Eye, 
  EyeOff, 
  Monitor, 
  Tablet, 
  Smartphone, 
  ZoomIn, 
  ZoomOut,
  Save,
  Undo,
  Redo
} from "lucide-react";

interface CanvasToolbarProps {
  previewMode: boolean;
  onTogglePreview: () => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  device: 'desktop' | 'tablet' | 'mobile';
  onDeviceChange: (device: 'desktop' | 'tablet' | 'mobile') => void;
  onSave: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  previewMode,
  onTogglePreview,
  zoom,
  onZoomChange,
  device,
  onDeviceChange,
  onSave,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo
}) => {
  const zoomLevels = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
  
  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'desktop': return Monitor;
      case 'tablet': return Tablet;
      case 'mobile': return Smartphone;
      default: return Monitor;
    }
  };

  return (
    <div className="border-b bg-background px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="h-8 w-8 p-0"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="h-8 w-8 p-0"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        {/* Device Preview */}
        <div className="flex items-center gap-1">
          {(['desktop', 'tablet', 'mobile'] as const).map((deviceType) => {
            const Icon = getDeviceIcon(deviceType);
            return (
              <Button
                key={deviceType}
                variant={device === deviceType ? "default" : "ghost"}
                size="sm"
                onClick={() => onDeviceChange(deviceType)}
                className="h-8 w-8 p-0"
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const currentIndex = zoomLevels.indexOf(zoom);
              if (currentIndex > 0) {
                onZoomChange(zoomLevels[currentIndex - 1]);
              }
            }}
            disabled={zoom <= zoomLevels[0]}
            className="h-8 w-8 p-0"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <Select
            value={String(zoom)}
            onValueChange={(value) => onZoomChange(parseFloat(value))}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {zoomLevels.map((level) => (
                <SelectItem key={level} value={String(level)}>
                  {Math.round(level * 100)}%
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const currentIndex = zoomLevels.indexOf(zoom);
              if (currentIndex < zoomLevels.length - 1) {
                onZoomChange(zoomLevels[currentIndex + 1]);
              }
            }}
            disabled={zoom >= zoomLevels[zoomLevels.length - 1]}
            className="h-8 w-8 p-0"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Preview Toggle */}
        <Button
          variant={previewMode ? "default" : "outline"}
          size="sm"
          onClick={onTogglePreview}
          className="flex items-center gap-2"
        >
          {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {previewMode ? 'Edit Mode' : 'Preview'}
        </Button>
        
        {/* Save Button */}
        <Button onClick={onSave} size="sm" className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};
