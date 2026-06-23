#!/usr/bin/env node

/**
 * Bob 專案批量更新腳本
 * 用於批量克隆或更新所有 bob 系統相關專案
 * 支援 git / glab，跨平台 (Windows / Linux / macOS)
 */

const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")
const readline = require("readline")

const SCRIPT_DIR = __dirname
const ROOT_DIR = path.resolve(SCRIPT_DIR, "..")
const REPOS_DIR = path.join(ROOT_DIR, "repos")
process.chdir(ROOT_DIR)

// 確保 repos 目錄存在
if (!fs.existsSync(REPOS_DIR)) {
  fs.mkdirSync(REPOS_DIR, { recursive: true })
}

// 顏色輸出
const colors = {
  RED: "\x1b[31m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  BLUE: "\x1b[34m",
  NC: "\x1b[0m",
}

function log(color, msg) {
  console.log(`${colors[color]}${msg}${colors.NC}`)
}

// readline 介面
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve))
}

// 定義所有專案的資訊（專案名稱:倉庫URL）
const projects = []

// 從 git URL 中提取 namespace/repo 路徑（供 glab/gh 使用）
// 例: git@gitlab.com:flightgo/bob-system/bob-backend.git → flightgo/bob-system/bob-backend
function extractRepoPath(url) {
  return url.replace(/^git@[^:]*:/, "").replace(/\.git$/, "")
}

// 判斷 URL 屬於哪個平台
function getPlatform(url) {
  if (url.includes("gitlab.com")) return "gitlab"
  if (url.includes("github.com")) return "github"
  return "unknown"
}

// 執行命令並回傳結果
function run(cmd, cwd) {
  try {
    const output = execSync(cmd, {
      cwd: cwd || SCRIPT_DIR,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    })
    return { success: true, output: output.trim() }
  } catch (err) {
    return { success: false, output: err.stderr || err.message }
  }
}

// 檢查命令是否存在
function commandExists(cmd) {
  const platform = process.platform
  const checkCmd = platform === "win32" ? `where ${cmd}` : `command -v ${cmd}`
  return run(checkCmd).success
}

// 處理單個專案
async function processProject(projectName, repoUrl, useCli) {
  log("YELLOW", "----------------------------------------")
  log("YELLOW", `處理專案: ${projectName}`)
  log("YELLOW", `倉庫 URL: ${repoUrl}`)
  log("YELLOW", "----------------------------------------")

  const projectPath = path.join(REPOS_DIR, projectName)

  if (fs.existsSync(projectPath)) {
    // 專案目錄已存在，進行更新
    log("BLUE", "專案目錄已存在，進行更新...")

    const gitDir = path.join(projectPath, ".git")
    if (!fs.existsSync(gitDir)) {
      log("RED", `錯誤: ${projectName} 不是有效的 Git 倉庫`)
      return "FAILED"
    }

    // 取得當前分支
    const branchResult = run("git branch --show-current", projectPath)
    const currentBranch =
      branchResult.success && branchResult.output
        ? branchResult.output
        : "detached"
    log("BLUE", `當前分支: ${currentBranch}`)

    // 檢查是否有未提交的更改
    const statusResult = run("git status --porcelain", projectPath)
    if (statusResult.success && statusResult.output) {
      log("YELLOW", "警告: 發現未提交的更改，將嘗試暫存...")
      run(
        `git stash push -m "Auto stash before update ${new Date().toISOString()}"`,
        projectPath,
      )
    }

    // 執行更新（統一使用 git pull）
    log("BLUE", "執行 git pull...")
    const pullResult = run(`git pull origin ${currentBranch}`, projectPath)
    if (pullResult.success) {
      log("GREEN", `✓ ${projectName} 更新成功`)
      return "UPDATED"
    } else {
      log("RED", `✗ ${projectName} 更新失敗`)
      return "FAILED"
    }
  } else {
    // 專案目錄不存在，進行克隆
    log("BLUE", "專案目錄不存在，進行克隆...")

    const platform = getPlatform(repoUrl)

    if (useCli && platform === "gitlab") {
      const repoPath = extractRepoPath(repoUrl)
      log("BLUE", `使用 glab repo clone ${repoPath}`)
      const cloneResult = run(
        `glab repo clone ${repoPath} ${projectName}`,
        REPOS_DIR,
      )
      if (cloneResult.success) {
        log("GREEN", `✓ ${projectName} 克隆成功`)
        return "CLONED"
      } else {
        log("RED", `✗ ${projectName} 克隆失敗`)
        return "FAILED"
      }
    } else if (useCli && platform === "github") {
      const repoPath = extractRepoPath(repoUrl)
      log("BLUE", `使用 gh repo clone ${repoPath}`)
      const cloneResult = run(
        `gh repo clone ${repoPath} ${projectName}`,
        REPOS_DIR,
      )
      if (cloneResult.success) {
        log("GREEN", `✓ ${projectName} 克隆成功`)
        return "CLONED"
      } else {
        log("RED", `✗ ${projectName} 克隆失敗`)
        return "FAILED"
      }
    } else {
      const cloneResult = run(`git clone ${repoUrl} ${projectName}`, REPOS_DIR)
      if (cloneResult.success) {
        log("GREEN", `✓ ${projectName} 克隆成功`)
        return "CLONED"
      } else {
        log("RED", `✗ ${projectName} 克隆失敗`)
        return "FAILED"
      }
    }
  }
}

async function main() {
  const startTime = new Date().toLocaleString("zh-TW")
  log("BLUE", "========================================")
  log("BLUE", "Bob 專案批量更新開始")
  log("BLUE", `開始時間: ${startTime}`)
  log("BLUE", "========================================")

  // 詢問使用者要使用 git 或是 CLI 工具
  console.log("")
  log("YELLOW", "請選擇要使用的工具:")
  log("YELLOW", "  1) git (Git 原生命令)")
  log("YELLOW", "  2) CLI (自動偵測: GitLab 用 glab, GitHub 用 gh)")
  const toolChoice = await ask("請輸入選項 [1/2]: ")

  let useCli = false
  if (toolChoice === "2") {
    useCli = true
    log("GREEN", "已選擇使用 CLI 工具 (自動偵測平台)")

    const hasGlab = commandExists("glab")
    const hasGh = commandExists("gh")

    if (hasGlab) {
      const version = run("glab --version")
      log("GREEN", `glab 版本: ${version.output}`)
    }
    if (hasGh) {
      const version = run("gh --version")
      log("GREEN", `gh 版本: ${version.output}`)
    }

    if (!hasGlab && !hasGh) {
      log("RED", "錯誤: glab 和 gh 都未安裝")
      log("YELLOW", "glab 安裝: https://gitlab.com/gitlab-org/cli#installation")
      log("YELLOW", "gh 安裝: https://cli.github.com/")
      rl.close()
      process.exit(1)
    }
  } else {
    log("GREEN", "已選擇使用 git")
    if (!commandExists("git")) {
      log("RED", "錯誤: git 未安裝")
      rl.close()
      process.exit(1)
    }
    const version = run("git --version")
    log("GREEN", `git 版本: ${version.output}`)
  }
  console.log("")

  let successCount = 0
  let failedCount = 0
  let updatedCount = 0
  let clonedCount = 0

  for (const projectLine of projects) {
    const [projectName, ...urlParts] = projectLine.split(":")
    const repoUrl = urlParts.join(":")

    const result = await processProject(projectName, repoUrl, useCli)

    switch (result) {
      case "UPDATED":
        successCount++
        updatedCount++
        break
      case "CLONED":
        successCount++
        clonedCount++
        break
      case "FAILED":
        failedCount++
        break
    }

    console.log("")
  }

  // 顯示統計結果
  const endTime = new Date().toLocaleString("zh-TW")
  log("BLUE", "========================================")
  log("BLUE", "Bob 專案批量更新完成")
  log("BLUE", `結束時間: ${endTime}`)
  log("BLUE", "========================================")
  log("GREEN", "統計結果:")
  log("GREEN", `  總專案數: ${projects.length}`)
  log("GREEN", `  成功數量: ${successCount}`)
  log("GREEN", `  失敗數量: ${failedCount}`)
  log("GREEN", `  新克隆: ${clonedCount}`)
  log("GREEN", `  已更新: ${updatedCount}`)
  log("BLUE", "========================================")

  rl.close()

  if (failedCount > 0) {
    log("RED", `注意: 有 ${failedCount} 個專案處理失敗，請檢查上述錯誤訊息`)
    process.exit(1)
  }

  log("GREEN", "所有專案處理完成！")
}

main()
