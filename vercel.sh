#!/bin/bash
if [ "$VERCEL_GIT_COMMIT_REF" == "main" ]; then exit 1; else exit 0; fi