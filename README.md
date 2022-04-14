# Bump Pre-Release Version

This action simply bumps the version of the package from `0.1.1` to `0.1.2-alpha`. Intended for bumping versions of npm packages post release.

## Outputs

### `new-version`

The new package version.

### `old-version`

The old package version.

## Example usage

```yaml
uses: alexweininger/bump-prerelease-version@main
```