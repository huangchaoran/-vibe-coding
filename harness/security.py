"""
Security Hooks for Gojica 2.0 Autonomous Agent
==============================================

OPEN MODE - No command restrictions.
This is a local development environment, so we allow all commands.
"""

import os
import shlex


async def bash_security_hook(input_data, tool_use_id=None, context=None):
    """
    Pre-tool-use hook - OPEN MODE, allows all commands.

    Args:
        input_data: Dict containing tool_name and tool_input
        tool_use_id: Optional tool use ID
        context: Optional context

    Returns:
        Empty dict to allow all commands
    """
    # Open mode - allow everything
    return {}
