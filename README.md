# Tower - Multiverse Nexus Cooldown Calculator

[Published on Netlify](https://mvn.thetower.tools/)

_A React app inspired by the  Multiverse Nexus after the rework in The Tower V0.23.5._

* Calculate cooldowns of Black Hole, Golden Tower and Death Wave, given all possible variables.
* Calculate whether Black Hole, Golden Tower are permanently active.

**Including V0.24.2 game mechanics:**
* Wave cooldowns
* MVN supported in perma calculator
* Updated stone values (seconds)
* New MVN rounding behavior (round to even / banker's rounding)

## Development

### Running the Linter

This project uses [Biome](https://biomejs.dev/) for linting and code formatting.

**Check for issues:**
```bash
npm run lint
```

**Auto-fix issues:**
```bash
npm run lint:fix
```

**Auto-fix with unsafe transformations:**
```bash
npm run lint -- --fix --unsafe
```

The `--unsafe` flag enables additional fixes that may change code behavior, such as:
- Converting useCallback dependencies
- Refactoring complex expressions
- Type inference improvements

### Pre-commit Hooks

This project uses [simple-git-hooks](https://github.com/toplenboren/simple-git-hooks) with [lint-staged](https://github.com/okonet/lint-staged) to automatically lint and fix staged files before each commit.

**Setup (already configured):**
- Pre-commit hook runs automatically on `git commit`
- Only lints files that are staged for commit
- Runs `biome check --write --unsafe` on `.js`, `.jsx`, `.ts`, and `.tsx` files

**Manual initialization (if needed):**
```bash
npx simple-git-hooks
```

### VSCode Setup

The project includes VSCode settings in `.vscode/settings.json` to:
- Format files with Biome on save
- Auto-fix linting issues on save
- Organize imports automatically

**Recommended extension:**
- [Biome VSCode Extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)

VSCode will prompt you to install recommended extensions when you open the project.
