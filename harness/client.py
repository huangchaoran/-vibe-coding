"""
Claude SDK Client Configuration
===============================

Functions for creating and configuring the Claude Agent SDK client.
Uses Playwright for browser automation (matching Gojica 2.0's existing test setup).
"""

import json
import os
from pathlib import Path

from claude_code_sdk import ClaudeCodeOptions, ClaudeSDKClient
from claude_code_sdk.types import HookMatcher

from security import bash_security_hook


# Playwright MCP tools for browser automation
PLAYWRIGHT_TOOLS = [
    "mcp__playwright__playwright_navigate",
    "mcp__playwright__playwright_screenshot",
    "mcp__playwright__playwright_click",
    "mcp__playwright__playwright_fill",
    "mcp__playwright__playwright_select",
    "mcp__playwright__playwright_hover",
    "mcp__playwright__playwright_evaluate",
    "mcp__playwright__playwright_assert_text",
    "mcp__playwright__playwright_wait_for_selector",
]

# Built-in tools
BUILTIN_TOOLS = [
    "Read",
    "Write",
    "Edit",
    "Glob",
    "Grep",
    "Bash",
]


def create_client(project_dir: Path, model: str) -> ClaudeSDKClient:
    """
    Create a Claude Agent SDK client.

    Args:
        project_dir: Directory for the project
        model: Claude model to use

    Returns:
        Configured ClaudeSDKClient
    """
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError(
            "ANTHROPIC_API_KEY environment variable not set.\n"
            "Get your API key from: https://console.anthropic.com/"
        )

    # Security settings - OPEN MODE (no restrictions)
    security_settings = {
        "sandbox": {"enabled": False},
        "permissions": {
            "defaultMode": "acceptEdits",
            "allow": [
                "Read(./**)",
                "Write(./**)",
                "Edit(./**)",
                "Glob(./**)",
                "Grep(./**)",
                "Bash(*)",
                *PLAYWRIGHT_TOOLS,
            ],
        },
    }

    # Ensure project directory exists
    project_dir.mkdir(parents=True, exist_ok=True)

    # Write settings to project directory
    settings_file = project_dir / ".claude_settings.json"
    with open(settings_file, "w") as f:
        json.dump(security_settings, f, indent=2)

    print(f"Created security settings at {settings_file}")
    print("   - Sandbox disabled (open mode for local dev)")
    print(f"   - Filesystem access: {project_dir.resolve()}")
    print("   - Bash commands: unrestricted")
    print("   - MCP servers: playwright (browser automation)")
    print()

    return ClaudeSDKClient(
        options=ClaudeCodeOptions(
            model=model,
            system_prompt="You are an expert full-stack developer working on Gojica 2.0, a music social platform. You have access to Playwright for E2E testing.",
            allowed_tools=[
                *BUILTIN_TOOLS,
                *PLAYWRIGHT_TOOLS,
            ],
            mcp_servers={
                "playwright": {
                    "command": "npx",
                    "args": ["@anthropic-ai/mcp-playwright"]
                }
            },
            hooks={
                "PreToolUse": [
                    HookMatcher(matcher="Bash", hooks=[bash_security_hook]),
                ],
            },
            max_turns=1000,
            cwd=str(project_dir.resolve()),
            settings=str(settings_file.resolve()),
        )
    )
