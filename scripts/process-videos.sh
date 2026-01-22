#!/bin/bash

# Pratyaksha Video Processing Script
# Extracts frames from 4K videos at multiple quality levels for adaptive loading
#
# Usage: ./process-videos.sh <input_video> <transition_name>
# Example: ./process-videos.sh dormant_to_chaos.mp4 t1
#
# Requirements:
# - FFmpeg installed and in PATH
# - Input videos in 4K resolution (3840x2160 recommended)
#
# Output structure:
# public/frames/{quality}/{transition}/frame_{0001-NNNN}.jpg
#
# Quality tiers:
# - 4k: 3840px width (original)
# - hd: 1920px width
# - sd: 960px width

set -e

# Configuration
FRAME_RATE=30  # Extract frames at 30fps (adjust based on your video)
JPEG_QUALITY=85  # JPEG quality (0-100)
OUTPUT_DIR="public/frames"

# Quality configurations
declare -A QUALITIES
QUALITIES["4k"]=3840
QUALITIES["hd"]=1920
QUALITIES["sd"]=960

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_usage() {
    echo "Usage: $0 <input_video> <transition_name>"
    echo ""
    echo "Arguments:"
    echo "  input_video     Path to the input video file (4K recommended)"
    echo "  transition_name Name of the transition (t1, t2, t3, or t4)"
    echo ""
    echo "Example:"
    echo "  $0 videos/dormant_to_chaos.mp4 t1"
}

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check arguments
if [ $# -lt 2 ]; then
    log_error "Missing required arguments"
    print_usage
    exit 1
fi

INPUT_VIDEO="$1"
TRANSITION_NAME="$2"

# Validate input video exists
if [ ! -f "$INPUT_VIDEO" ]; then
    log_error "Input video not found: $INPUT_VIDEO"
    exit 1
fi

# Validate transition name
if [[ ! "$TRANSITION_NAME" =~ ^t[1-4]$ ]]; then
    log_warn "Non-standard transition name: $TRANSITION_NAME"
fi

# Check FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    log_error "FFmpeg is not installed or not in PATH"
    exit 1
fi

log_info "Processing video: $INPUT_VIDEO"
log_info "Transition: $TRANSITION_NAME"

# Get video info
VIDEO_DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$INPUT_VIDEO")
VIDEO_WIDTH=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of default=noprint_wrappers=1:nokey=1 "$INPUT_VIDEO")
VIDEO_HEIGHT=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of default=noprint_wrappers=1:nokey=1 "$INPUT_VIDEO")

log_info "Video info: ${VIDEO_WIDTH}x${VIDEO_HEIGHT}, ${VIDEO_DURATION}s"

# Calculate expected frame count
EXPECTED_FRAMES=$(echo "$VIDEO_DURATION * $FRAME_RATE" | bc | cut -d'.' -f1)
log_info "Expected frames: ~$EXPECTED_FRAMES"

# Process each quality tier
for QUALITY in "${!QUALITIES[@]}"; do
    WIDTH=${QUALITIES[$QUALITY]}
    OUTPUT_PATH="$OUTPUT_DIR/$QUALITY/$TRANSITION_NAME"

    log_info "Processing $QUALITY quality ($WIDTH px)..."

    # Create output directory
    mkdir -p "$OUTPUT_PATH"

    # Calculate height maintaining aspect ratio
    HEIGHT=$(echo "$WIDTH * $VIDEO_HEIGHT / $VIDEO_WIDTH" | bc)

    # Extract frames with FFmpeg
    ffmpeg -i "$INPUT_VIDEO" \
        -vf "scale=$WIDTH:$HEIGHT:flags=lanczos,fps=$FRAME_RATE" \
        -q:v $((100 - JPEG_QUALITY)) \
        -start_number 1 \
        "$OUTPUT_PATH/frame_%04d.jpg" \
        -y \
        -loglevel warning

    # Count extracted frames
    FRAME_COUNT=$(ls -1 "$OUTPUT_PATH"/*.jpg 2>/dev/null | wc -l)
    log_info "$QUALITY: Extracted $FRAME_COUNT frames to $OUTPUT_PATH"
done

# Generate frame manifest entry
log_info "Generating manifest entry..."

echo ""
echo "Add this to frame-manifest.json:"
echo "\"$TRANSITION_NAME\": {"
echo "  \"path\": \"/frames/hd/$TRANSITION_NAME\","
echo "  \"count\": $(ls -1 "$OUTPUT_DIR/hd/$TRANSITION_NAME"/*.jpg 2>/dev/null | wc -l),"
echo "  \"pattern\": \"frame_%04d.jpg\""
echo "}"
echo ""

# Calculate total size
TOTAL_SIZE_4K=$(du -sh "$OUTPUT_DIR/4k/$TRANSITION_NAME" 2>/dev/null | cut -f1 || echo "N/A")
TOTAL_SIZE_HD=$(du -sh "$OUTPUT_DIR/hd/$TRANSITION_NAME" 2>/dev/null | cut -f1 || echo "N/A")
TOTAL_SIZE_SD=$(du -sh "$OUTPUT_DIR/sd/$TRANSITION_NAME" 2>/dev/null | cut -f1 || echo "N/A")

echo "Size summary:"
echo "  4K: $TOTAL_SIZE_4K"
echo "  HD: $TOTAL_SIZE_HD"
echo "  SD: $TOTAL_SIZE_SD"

log_info "Processing complete!"
