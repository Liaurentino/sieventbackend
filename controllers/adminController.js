import userModel from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";

export const getSiCreatorRequests = async (req, res) => {
  try {
    const { institutionName } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "File KTP wajib diunggah." });
    }

    if (!institutionName || institutionName.trim() === '') {
      return res.status(400).json({ success: false, message: "Nama instansi wajib diisi." });
    }

    const userId = req.user._id; 
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Pengguna tidak ditemukan." });
    }

    if (user.siCreatorRequest || user.isSiCreator) {
      return res.status(400).json({ success: false, message: "Permintaan sudah diajukan atau pengguna sudah menjadi SiCreator." });
    }

    let uploadResult;
    try {
      uploadResult = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
        {
          folder: `ktp_uploads/${user._id}`,
          public_id: `ktp-${user._id}-${Date.now()}`,
          resource_type: 'image'
        }
      );
    } catch (cloudErr) {
      return res.status(500).json({ success: false, message: "Gagal mengunggah KTP ke Cloudinary.", error: cloudErr.message });
    }

    user.siCreatorRequest = true;
    user.ktpUrl = uploadResult.secure_url;
    user.institutionName = institutionName;
    await user.save();

    res.status(200).json({ success: true, message: "Permintaan SiCreator berhasil diajukan.", user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Kesalahan server", error: err.message });
  }
};
export const SeeRequestSiCreators = async (req, res) => {
  try {
    const creators = await userModel.find(
      { isSiCreator: true },
      "name email institutionName ktpUrl createdAt"
    ).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: creators
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Gagal mengambil data SiCreator", error: err.message });
  }
};

export const acceptSiCreatorRequest = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan." });
    }

    if (!user.siCreatorRequest || !user.ktpUrl) {
      return res.status(400).json({ message: "Permintaan belum diajukan atau belum ada KTP." });
    }

    // Set sebagai SiCreator
    user.isSiCreator = true;
    user.siCreatorRequest = false;

    await user.save();
    res.status(200).json({ message: "Pengguna berhasil disetujui sebagai SiCreator.", user });
  } catch (err) {
    res.status(500).json({ message: "Kesalahan server", error: err.message });
  }
};
