// Prevent branch publishing from racing this workflow and replacing dist with raw source.
const repository = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
if (!repository || !token) throw new Error('This check must run inside the GitHub Pages workflow.');
const response = await fetch('https://api.github.com/repos/'+repository+'/pages', {
  headers: { Authorization:'Bearer '+token, Accept:'application/vnd.github+json', 'X-GitHub-Api-Version':'2022-11-28' },
});
if (!response.ok) throw new Error('Could not verify Pages configuration (HTTP '+response.status+').');
const pages = await response.json();
if (pages.build_type !== 'workflow') throw new Error('Set Settings > Pages > Build and deployment > Source to GitHub Actions. Branch publishing serves uncompiled source and can overwrite this deployment.');
console.log('Verified GitHub Actions is the only Pages publishing source.');
