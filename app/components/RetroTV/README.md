# Retro TV UI Components

This folder contains components for creating a nostalgic retro TV user interface for the MagicVid application.

## Components

### RetroTV
The main wrapper component that creates the TV appearance with scanlines, static noise, and CRT screen effect.

```tsx
<RetroTV 
  isOn={true} 
  staticIntensity={0.2}
  showStatic={true}
  showScanlines={true}
>
  {children}
</RetroTV>
```

#### Props
- `isOn`: Boolean to control if the TV is powered on
- `staticIntensity`: Number between 0-1 controlling the intensity of the TV static
- `showStatic`: Boolean to toggle the static effect
- `showScanlines`: Boolean to toggle the scanline effect

### TVInterface
Creates the menu interface inside the TV with channel buttons.

```tsx
<TVInterface
  activeTab="upload"
  onTabChange={(tab) => handleTabChange(tab)}
/>
```

#### Props
- `activeTab`: String representing the active tab/channel
- `onTabChange`: Function to call when a tab/channel is selected

### RetroTVApp
Main application component that combines RetroTV, TVInterface, and content components.

```tsx
<RetroTVApp
  uploadComponent={<YourUploadComponent />}
  customizeComponent={<YourCustomizeComponent />}
  generateComponent={<YourGenerateComponent />}
  videoComponent={<YourVideoComponent />}
/>
```

#### Props
- `uploadComponent`: React node for the upload tab
- `customizeComponent`: React node for the customize tab
- `generateComponent`: React node for the generate tab
- `videoComponent`: React node for the video player tab

### TVComponents
Wrapper components for forms and other UI elements:

- `TVUploadForm`: For image upload functionality
- `TVCustomizeForm`: For customizing video generation parameters
- `TVGenerateComponent`: For the video generation process
- `TVVideoComponent`: For playing and downloading the generated video

## How to Use

Import the components from the RetroTV folder:

```tsx
import { 
  RetroTVApp, 
  TVUploadForm, 
  TVCustomizeForm, 
  TVGenerateComponent, 
  TVVideoComponent 
} from './components/RetroTV';
```

Then use them in your page:

```tsx
export default function HomePage() {
  // Your state and logic here
  
  return (
    <RetroTVApp
      uploadComponent={<TVUploadForm {...uploadProps} />}
      customizeComponent={<TVCustomizeForm {...customizeProps} />}
      generateComponent={<TVGenerateComponent {...generateProps} />}
      videoComponent={<TVVideoComponent {...videoProps} />}
    />
  );
}
```

## Styling

The components use CSS modules for styling. You can customize the appearance by modifying:

- `RetroTV.module.css`: TV appearance and effects
- `TVInterface.module.css`: Menu and navigation styling
- `RetroTVApp.module.css`: Overall layout and container styling
- `TVComponents.module.css`: Form elements and component styling 