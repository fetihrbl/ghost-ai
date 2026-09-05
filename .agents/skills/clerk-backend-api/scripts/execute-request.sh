#!/usr/bin/env bash

# Execute a Clerk Backend API request with scope enforcement.
#
# Usage: bash execute-request.sh [--admin] <METHOD> <PATH> [BODY]
#
# Scope enforcement:
#   GET     — always allowed
#   POST, PUT, PATCH — requires CLERK_BAPI_SCOPES="write" or --admin flag
#   DELETE  — requires CLERK_BAPI_SCOPES="write,delete" or --admin flag

set -euo pipefail

# Walk up from $PWD to find .env.local/.env (mirrors Clerk CLI behavior).
# Parse only CLERK_SECRET_KEY; never execute shell content from an env file.
if [[ ! -v CLERK_SECRET_KEY ]]; then
  _dir="$PWD"
  while true; do
    for _envfile in "$_dir/.env.local" "$_dir/.env"; do
      [[ -f "$_envfile" ]] || continue
      while IFS= read -r _line || [[ -n "$_line" ]]; do
        _line="${_line%$'\r'}"
        if [[ "$_line" =~ ^[[:space:]]*(export[[:space:]]+)?CLERK_SECRET_KEY[[:space:]]*=(.*)$ ]]; then
          _value="${BASH_REMATCH[2]}"
          _value="${_value#"${_value%%[![:space:]]*}"}"
          _value="${_value%"${_value##*[![:space:]]}"}"
          if [[ ${#_value} -ge 2 ]] &&
            { [[ "${_value:0:1}" == '"' && "${_value: -1}" == '"' ]] ||
              [[ "${_value:0:1}" == "'" && "${_value: -1}" == "'" ]]; }; then
            _value="${_value:1:${#_value}-2}"
          fi
          CLERK_SECRET_KEY="$_value"
          export CLERK_SECRET_KEY
          break 2
        fi
      done < "$_envfile"
    done
    [[ -v CLERK_SECRET_KEY ]] && break
    _parent="$(dirname "$_dir")"
    [[ "$_parent" == "$_dir" ]] && break
    _dir="$_parent"
  done
  unset _dir _parent _envfile _line _value
fi

# Parse --admin flag
ADMIN=false
if [[ "${1:-}" == "--admin" ]]; then
  ADMIN=true
  shift
fi

METHOD="${1:?Usage: execute-request.sh [--admin] <METHOD> <PATH> [BODY]}"
PATH_ARG="${2:?Usage: execute-request.sh [--admin] <METHOD> <PATH> [BODY]}"
BODY="${3:-}"

METHOD_UPPER=$(echo "$METHOD" | tr '[:lower:]' '[:upper:]')
SCOPES="${CLERK_BAPI_SCOPES:-}"

# Scope check
if [[ "$ADMIN" == false ]]; then
  case "$METHOD_UPPER" in
    GET)
      ;; # always allowed
    POST|PUT|PATCH)
      if [[ "$SCOPES" != *"write"* ]]; then
        echo "ERROR: $METHOD_UPPER requests require CLERK_BAPI_SCOPES=\"write\" or --admin flag." >&2
        echo "Current CLERK_BAPI_SCOPES: \"$SCOPES\"" >&2
        exit 1
      fi
      ;;
    DELETE)
      if [[ "$SCOPES" != *"write"* ]] || [[ "$SCOPES" != *"delete"* ]]; then
        echo "ERROR: DELETE requests require CLERK_BAPI_SCOPES=\"write,delete\" or --admin flag." >&2
        echo "Current CLERK_BAPI_SCOPES: \"$SCOPES\"" >&2
        exit 1
      fi
      ;;
    *)
      echo "ERROR: Unknown HTTP method: $METHOD_UPPER" >&2
      exit 1
      ;;
  esac
fi

# Base URL is an unversioned origin; normalize it before adding /v1 below.
BASE_URL="${CLERK_BACKEND_API_URL:-https://api.clerk.dev}"
BASE_URL="${BASE_URL%/}"
BASE_URL="${BASE_URL%/v1}"

# Build curl command
CURL_ARGS=(
  -s
  -X "$METHOD_UPPER"
  "${BASE_URL}/v1${PATH_ARG}"
  -H "Authorization: Bearer ${CLERK_SECRET_KEY:?CLERK_SECRET_KEY is not set}"
  -H "Content-Type: application/json"
)

if [[ -n "$BODY" ]]; then
  CURL_ARGS+=(-d "$BODY")
fi

curl "${CURL_ARGS[@]}"
