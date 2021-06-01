const router = require("express").Router();
const {
  handleResourceNotFountError,
  handleJSONResponse,
} = require("../middlewares/errorHandler");
const api = require("../api");
const { checkAuthN } = require("../middlewares/auth");

router.get("/live", api.http(api.AppStatusAPI.getLiveStatus));

// User APIs
router.post("/users/sign-up", api.http(api.UserApi.signup));
router.post("/users/verify-email", api.http(api.UserApi.verifyEmail));
router.post("/users/sign-in", api.http(api.UserApi.signIn));
router.get("/users/refresh", api.http(api.UserApi.refreshAccessToken));
router.post("/users/sign-out", api.http(api.UserApi.signOut));
router.post("/users/forgot-password", api.http(api.UserApi.sendForgotPasswordLink));
router.post("/users/reset-password", api.http(api.UserApi.resetPassword));

// Folder APIs
router.post("/folders", checkAuthN, api.http(api.FolderApi.createFolder));
router.get("/folders", checkAuthN, api.http(api.FolderApi.getUserFolderList));
router.patch(
  "/folders/:folderId",
  checkAuthN,
  api.http(api.FolderApi.updateFolder)
);
router.delete(
  "/folders/:folderId",
  checkAuthN,
  api.http(api.FolderApi.deleteFolder)
);

// Notes APIs
router.post(
  "/folders/:folderId/notes",
  checkAuthN,
  api.http(api.NoteApi.createNote)
);
router.get(
  "/folders/:folderId/notes",
  checkAuthN,
  api.http(api.NoteApi.getFolderNotes)
);
router.get("/notes/:noteId", checkAuthN, api.http(api.NoteApi.getDetails));
router.patch("/notes/:noteId", checkAuthN, api.http(api.NoteApi.updateNote));
router.delete("/notes/:noteId", checkAuthN, api.http(api.NoteApi.deleteNote));
router.get("/archive/notes", checkAuthN, api.http(api.NoteApi.getArchiveNotes));
router.delete(
  "/archive/notes/:noteId",
  checkAuthN,
  api.http(api.NoteApi.deleteArchiveNote)
);
router.get(
  "/archive/notes/:noteId",
  checkAuthN,
  api.http(api.NoteApi.getArchiveNoteDetails)
);
router.patch(
  "/archive/notes/:noteId",
  checkAuthN,
  api.http(api.NoteApi.restoreNote)
);

// Middleware to handle not found error and other errors
router.use(handleResourceNotFountError);
router.use(handleJSONResponse);

module.exports = router;
