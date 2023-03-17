/*
// The module 'vscode' contains the VS Code extensibility API
*/

import { window, commands, ExtensionContext, Disposable } from "vscode";
import { SingleStepSearch } from "./basicInput";

export async function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand("smart-command.NLPSearch", async () => {
      /*
		const options: { [key: string]: (context: ExtensionContext) => Promise<void> } = {
			SingleStepSearch,
		};
		const quickPick = window.createQuickPick();
		quickPick.items = Object.keys(options).map(label => ({ label }));
		quickPick.onDidChangeSelection(selection => {
			if (selection[0]) {
				options[selection[0].label](context)
					.catch(console.error);
			}
		});
		quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show();*/
      SingleStepSearch();
    })
  );

  let paletteEnabled = await context.globalState.get("paletteEnabled", false);

  // command to register (replacing the editor default "workbench.action.showCommands")
  let myPaletteCommand: Disposable;

  if (paletteEnabled) {
    myPaletteCommand = registerCustomPalette();

    context.subscriptions.push(myPaletteCommand);
  }

  context.subscriptions.push(
    commands.registerCommand("smart-command:toggleCommandPalette", async () => {
      await context.globalState.update(
        "paletteEnabled",
        (paletteEnabled = !paletteEnabled)
      );
      if (paletteEnabled) {
        window.showInformationMessage("Smart Command Palette Enabled.");
        myPaletteCommand = registerCustomPalette();
        context.subscriptions.push(myPaletteCommand);
        return;
      }
      window.showInformationMessage("Smart Command Palette Disabled.");
      myPaletteCommand?.dispose();
    })
  );
}

function registerCustomPalette() {
  return commands.registerCommand("workbench.action.showCommands", async () => {
    commands.executeCommand("smart-command.NLPSearch");
  });
}
