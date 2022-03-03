const { default: mongoose } = require("mongoose");
const Note = require("../models/notes");
const User = require("../models/user");

exports.addNote = (req, res) => {
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const err = new Error("user not found");
        err.statusCode = 404;
        throw err;
      }

      return user.addNote({
        comment: req.body.comment,
        movieId: req.params.movieId,
      });
    })
    .then((id) => {
      res.status(200).json({
        data: {
          comment: req.body.comment,
          movieId: req.params.movieId,
          _id: id,
        },
      });
    })

    .catch((err) => {
      throw err;
    });
};
exports.getNotes = (req, res) => {
  User.findById(req.userId)
    .then((user) => {
      user.populate("notes").then((populatedUserNotes) => {
        console.log(req.params.movieId, "params ");
        res.status(200).json({
          data: populatedUserNotes.notes.filter((note) => {
            if (note.movieId.trim() === req.params.movieId.trim()) {
              return {
                comment: note.comment,
                movieId: note.movieId,
              };
            } else return;
          }),
        });
      });
    })
    .catch((err) => {
      throw err;
    });
};
exports.deleteNote = (req, res) => {
  User.findById(req.userId).then((user) => {
    if (!user) {
      const err = new Error("user not found");
      err.statusCode = 404;
      throw err;
    }
    Note.findOneAndDelete({ _id: mongoose.Types.ObjectId(req.body.id) }).then(
      (result) => {
        res.status(200).json({
          data: result,
        });
        user.deleteOneNote(req.body.id);
      }
    );
  });
};
