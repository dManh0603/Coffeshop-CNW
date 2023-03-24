const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const dotenv = require('dotenv');
dotenv.config();

const GOOGLEDRIVE_CLIENT_ID = process.env.GOOGLEDRIVE_CLIENT_ID;
const GOOGLEDRIVE_CLIENT_SECRET = process.env.GOOGLEDRIVE_CLIENT_SECRET;
const GOOGLEDRIVE_REDIRECT_URI = process.env.GOOGLEDRIVE_REDIRECT_URI;
const GOOGLEDRIVE_REFRESH_TOKEN = process.env.GOOGLEDRIVE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  GOOGLEDRIVE_CLIENT_ID,
  GOOGLEDRIVE_CLIENT_SECRET,
  GOOGLEDRIVE_REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: GOOGLEDRIVE_REFRESH_TOKEN });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});

const googleDrive = {
  async toGoogle(req, res, next) {
    try {
      const { path: filePath, mimetype } = req.file;

      const createdFile = await drive.files.create({
        requestBody: {
          name: path.basename(filePath),
          mimeType: mimetype,
        },
        media: {
          mimeType: mimetype,
          body: fs.createReadStream(filePath),
        },
      });

      const fileId = createdFile.data.id;
      req.body.imageId = fileId;
      await googleDrive.setFilePublic(fileId);

      const file = await drive.files.get({ fileId });

      console.log('File Properties:', file.data);
      // res.json(req.body);
      next()
      // res.send('File uploaded successfully!');
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while uploading the file');
      next();
    }
  },

  async setFilePublic(fileId) {
    try {
      await drive.permissions.create({
        fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
        supportsAllDrives: true,
      });
    } catch (error) {
      console.error(error);
    }
  },

  async deleteFile(fileId) {
    try {
      console.log('2', fileId);
      const deleteFile = await drive.files.delete({
        fileId: fileId
      })
      console.log(deleteFile.data, deleteFile.status);
    } catch (error) {
      console.error(error);
    }
  }
};

module.exports = googleDrive;
