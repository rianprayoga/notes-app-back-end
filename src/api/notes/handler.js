class NotesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
  }

  async postNoteHandler(request, h) {
    this._validator.validateNotePayload(request.payload);

    const { title = 'untitled', tags, body } = request.payload;
    const id = await this._service.addNote({ title, body, tags });

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  async getNotesHandler() {
    const notes = await this._service.getNotes();
    return {
      status: 'success',
      data: {
        notes,
      },
    };
  }

  async getNoteByIdHandler(request) {
    const { id } = request.params;
    const note = await this._service.getNoteById(id);

    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  async putNoteByIdHandler(request, h) {
    const { id } = request.params;

    this._validator.validateNotePayload(request.payload);

    const { title, body, tags } = request.payload;
    await this._service.editNoteById(
      id,
      { title, body, tags },
    );

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  async deleteNoteByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteNoteById(id);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = NotesHandler;
