Certainly! Here's a concise guide to help the user install **FFmpeg** and **FFprobe** using npm, and how to update the **ffprobe** path in your `tts.js` file. I’ll also include a basic README template for your GitHub repository.

---

### **Step-by-Step Guide to Install FFmpeg and FFprobe using npm**

#### **1. Install FFmpeg and FFprobe with npm**

To install FFmpeg and FFprobe for your Node.js project, you can use the `fluent-ffmpeg` package. This package provides a wrapper around FFmpeg, making it easier to work with audio and video processing in Node.js.

- Open your terminal or command prompt.
- Navigate to your project directory.
- Run the following command to install the required npm package:

```bash
npm install fluent-ffmpeg
```

This will install **FFmpeg** and **FFprobe** dependencies. However, if you also need the actual binary files (FFmpeg and FFprobe executables), you can install the **ffmpeg-static** package, which provides precompiled binaries for FFmpeg and FFprobe.

```bash
npm install ffmpeg-static
```

#### **2. Update the Path to FFprobe in `tts.js`**

Once the installation is complete, you'll need to update the path to `ffprobe` in your **`/audio-service/tts.js`** file to ensure that the application can find and use it.

- Open **`/audio-service/tts.js`** in your text editor.
- Locate the line where `ffprobe` is being referenced (it’s often used as part of `fluent-ffmpeg` for metadata extraction).
- Update the path to the correct location of the `ffprobe` binary provided by `ffmpeg-static`.

Example:

```javascript
const ffmpeg = require('fluent-ffmpeg');
const ffprobePath = require('ffmpeg-static').path;  // This sets ffprobe's path

ffmpeg.setFfprobePath(ffprobePath);
```

This ensures that `ffmpeg` and `ffprobe` use the static binaries provided by the `ffmpeg-static` package, so you don’t need to manually set paths on your system.

#### **3. Test the Setup**

After updating the path, run your project to ensure that **FFmpeg** and **FFprobe** are working correctly with the updated configuration.

```bash
node app.js
```

If everything is set up correctly, there should be no errors related to FFmpeg or FFprobe.

---

### **Basic README Template for GitHub Repository**

Here’s a simple template for your repository’s `README.md` file:

```markdown
# Audio Service - TTS (Text-to-Speech) API

This project provides a custom Text-to-Speech service powered by **FFmpeg** and **FFprobe**, built with Node.js. It allows users to convert text into audio and customize their audio sessions.

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/cpatra11/ai-meditation.git
   cd audio-service
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

   This will install the required libraries, including **FFmpeg** and **FFprobe**.

3. Install **FFmpeg** and **FFprobe**:

   The project uses **`fluent-ffmpeg`** with **`ffmpeg-static`** to manage FFmpeg and FFprobe binaries.

   To install FFmpeg and FFprobe via npm:

   ```bash
   npm install fluent-ffmpeg ffmpeg-static
   ```

4. Configure the path to **FFprobe** in **`/audio-service/tts.js`**:

   Make sure the `ffprobe` path is correctly set in `tts.js`:

   ```javascript
   const ffmpeg = require('fluent-ffmpeg');
   const ffprobePath = require('ffmpeg-static').path;  // This sets ffprobe's path

   ffmpeg.setFfprobePath(ffprobePath);
   ```

## Usage

1. Run the application:
   cd to server and run

   ```bash
pnpm run dev   ```



---
cd to new and run ```bash npm run dev ```


To run server add these envs
```bash

PORT=4000

ADMIN_EMAIL=bhalu@cpun.com
ADMIN_PASSWORD=123456
JWT_SECRET=

RAPID_API_KEY=

PATH=


```


To run frontend, add these envs-.env.local-
```bash
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

MONGODB_URI=

HUGGINGFACE_API_KEY=

API_URL= // this is the full url of the backend e.g. http:localhost:4000

MONGODB_URI=
```

This guide and README should help users set up FFmpeg and FFprobe with npm in your project, as well as provide a clear overview of how to get started with the repo. Let me know if you need any further changes!
