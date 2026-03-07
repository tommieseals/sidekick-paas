import fs from 'fs-extra';
import path from 'path';

/**
 * Project Type Detector
 * 
 * Analyzes a repository to detect the project type and configuration
 */

const PROJECT_TYPES = {
  NEXTJS: 'nextjs',
  REACT: 'react',
  VUE: 'vue',
  EXPRESS: 'express',
  NODEJS: 'nodejs',
  PYTHON_FASTAPI: 'fastapi',
  PYTHON_FLASK: 'flask',
  PYTHON_DJANGO: 'django',
  PYTHON: 'python',
  GO: 'go',
  RUST: 'rust',
  STATIC: 'static',
  DOCKERFILE: 'dockerfile'
};

/**
 * Detect project type from repository
 * @param {string} repoPath - Path to cloned repository
 * @returns {object} Detection result
 */
export async function detectProjectType(repoPath) {
  const result = {
    type: null,
    framework: null,
    port: null,
    buildCommand: null,
    startCommand: null,
    installCommand: null,
    outputDir: null,
    confidence: 0
  };
  
  // Check if Dockerfile already exists
  if (await fs.pathExists(path.join(repoPath, 'Dockerfile'))) {
    return {
      ...result,
      type: PROJECT_TYPES.DOCKERFILE,
      confidence: 1.0,
      message: 'Using existing Dockerfile'
    };
  }
  
  // Check for package.json (Node.js)
  const packageJsonPath = path.join(repoPath, 'package.json');
  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath);
    return detectNodeProject(packageJson, repoPath);
  }
  
  // Check for Python
  if (await fs.pathExists(path.join(repoPath, 'requirements.txt')) ||
      await fs.pathExists(path.join(repoPath, 'pyproject.toml'))) {
    return await detectPythonProject(repoPath);
  }
  
  // Check for Go
  if (await fs.pathExists(path.join(repoPath, 'go.mod'))) {
    return {
      ...result,
      type: PROJECT_TYPES.GO,
      port: 8080,
      buildCommand: 'go build -o app',
      startCommand: './app',
      confidence: 0.9
    };
  }
  
  // Check for Rust
  if (await fs.pathExists(path.join(repoPath, 'Cargo.toml'))) {
    return {
      ...result,
      type: PROJECT_TYPES.RUST,
      port: 8080,
      buildCommand: 'cargo build --release',
      startCommand: './target/release/app',
      confidence: 0.9
    };
  }
  
  // Check for static site
  if (await fs.pathExists(path.join(repoPath, 'index.html'))) {
    return {
      ...result,
      type: PROJECT_TYPES.STATIC,
      port: 80,
      confidence: 0.8,
      message: 'Static HTML site detected'
    };
  }
  
  return {
    ...result,
    type: null,
    confidence: 0,
    error: 'Could not detect project type'
  };
}

/**
 * Detect Node.js project specifics
 */
function detectNodeProject(packageJson, repoPath) {
  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };
  
  const scripts = packageJson.scripts || {};
  
  const result = {
    type: PROJECT_TYPES.NODEJS,
    framework: null,
    port: 3000,
    buildCommand: scripts.build ? 'npm run build' : null,
    startCommand: scripts.start ? 'npm start' : 'node index.js',
    installCommand: 'npm ci',
    outputDir: null,
    confidence: 0.8
  };
  
  // Detect Next.js
  if (deps.next) {
    return {
      ...result,
      type: PROJECT_TYPES.NEXTJS,
      framework: 'Next.js',
      port: 3000,
      buildCommand: 'npm run build',
      startCommand: 'npm start',
      outputDir: '.next',
      confidence: 0.95
    };
  }
  
  // Detect React (Create React App or Vite)
  if (deps.react && (deps['react-scripts'] || deps.vite)) {
    return {
      ...result,
      type: PROJECT_TYPES.REACT,
      framework: deps.vite ? 'Vite + React' : 'Create React App',
      port: deps.vite ? 4173 : 3000,
      buildCommand: 'npm run build',
      startCommand: deps.vite ? 'npm run preview' : 'npx serve -s build',
      outputDir: deps.vite ? 'dist' : 'build',
      confidence: 0.9
    };
  }
  
  // Detect Vue
  if (deps.vue) {
    return {
      ...result,
      type: PROJECT_TYPES.VUE,
      framework: 'Vue.js',
      port: 4173,
      buildCommand: 'npm run build',
      startCommand: 'npm run preview',
      outputDir: 'dist',
      confidence: 0.9
    };
  }
  
  // Detect Express
  if (deps.express) {
    return {
      ...result,
      type: PROJECT_TYPES.EXPRESS,
      framework: 'Express.js',
      port: parseInt(process.env.PORT) || 3000,
      confidence: 0.85
    };
  }
  
  return result;
}

/**
 * Detect Python project specifics
 */
async function detectPythonProject(repoPath) {
  const result = {
    type: PROJECT_TYPES.PYTHON,
    framework: null,
    port: 8000,
    buildCommand: null,
    startCommand: 'python app.py',
    installCommand: 'pip install -r requirements.txt',
    confidence: 0.7
  };
  
  // Try to read requirements.txt
  const reqPath = path.join(repoPath, 'requirements.txt');
  if (await fs.pathExists(reqPath)) {
    const requirements = await fs.readFile(reqPath, 'utf-8');
    
    if (requirements.includes('fastapi')) {
      return {
        ...result,
        type: PROJECT_TYPES.PYTHON_FASTAPI,
        framework: 'FastAPI',
        port: 8000,
        startCommand: 'uvicorn main:app --host 0.0.0.0 --port 8000',
        confidence: 0.9
      };
    }
    
    if (requirements.includes('flask')) {
      return {
        ...result,
        type: PROJECT_TYPES.PYTHON_FLASK,
        framework: 'Flask',
        port: 5000,
        startCommand: 'flask run --host=0.0.0.0',
        confidence: 0.9
      };
    }
    
    if (requirements.includes('django')) {
      return {
        ...result,
        type: PROJECT_TYPES.PYTHON_DJANGO,
        framework: 'Django',
        port: 8000,
        startCommand: 'python manage.py runserver 0.0.0.0:8000',
        confidence: 0.9
      };
    }
  }
  
  return result;
}

/**
 * Get display name for project type
 */
export function getProjectTypeDisplayName(type) {
  const names = {
    [PROJECT_TYPES.NEXTJS]: 'Next.js',
    [PROJECT_TYPES.REACT]: 'React',
    [PROJECT_TYPES.VUE]: 'Vue.js',
    [PROJECT_TYPES.EXPRESS]: 'Express.js',
    [PROJECT_TYPES.NODEJS]: 'Node.js',
    [PROJECT_TYPES.PYTHON_FASTAPI]: 'FastAPI',
    [PROJECT_TYPES.PYTHON_FLASK]: 'Flask',
    [PROJECT_TYPES.PYTHON_DJANGO]: 'Django',
    [PROJECT_TYPES.PYTHON]: 'Python',
    [PROJECT_TYPES.GO]: 'Go',
    [PROJECT_TYPES.RUST]: 'Rust',
    [PROJECT_TYPES.STATIC]: 'Static Site',
    [PROJECT_TYPES.DOCKERFILE]: 'Custom Dockerfile'
  };
  return names[type] || type;
}

export { PROJECT_TYPES };
