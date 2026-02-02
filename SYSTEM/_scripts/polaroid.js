module.exports = {
  entry: async (QuickAdd, settings) => {
    const editor = QuickAdd.app.workspace.activeEditor.editor;
    if (!editor) {
      new QuickAdd.app.Notice("No active editor. Please open a file.");
      return;
    }

    const caption = await QuickAdd.quickAddApi.inputPrompt("Enter caption", "Caption");
    if (!caption) {
      return;
    }

    const callout = `> [!polaroid] ${caption}\n> `;
    editor.replaceSelection(callout);
    const cursorPos = editor.getCursor();

    try {
      const eventRef = QuickAdd.app.workspace.on('editor-change', (changedEditor) => {
        // We only care about changes in the active editor
        if (changedEditor !== editor) {
          return;
        }

        const newLine = changedEditor.getLine(cursorPos.line);
        
        // Check if the line has been updated by the plugin and contains encoding
        if (newLine.includes("![[") && newLine.includes("%")) {
          const match = newLine.match(/!\[\[(.*)\]\]/);
          if (match && match[1]) {
            let path = match[1];
            path = decodeURIComponent(path);
            const finalLine = `> ![[${path}]]`;
            changedEditor.setLine(cursorPos.line, finalLine);
          }
          // Important: unregister the event listener
          QuickAdd.app.workspace.offref(eventRef);
        }
      });

      // Trigger the photo picker
      QuickAdd.app.commands.executeCommandById("google-photos:open-photo-picker");

      // Set a timeout to clean up the listener if the user cancels the picker
      setTimeout(() => {
        QuickAdd.app.workspace.offref(eventRef);
      }, 15000); // 15-second timeout

    } catch (err) {
      new QuickAdd.app.Notice("Error: Could not run the Google Photos command. Is the plugin enabled?");
      console.error(err);
    }
  }
};
