FROM python:3.11-alpine

# Create a non-privileged user
RUN addgroup -S sandbox && adduser -S -G sandbox -u 1001 sandbox

# Set working directory
WORKDIR /sandbox

# Copy runner harness if needed (or mounted dynamically)
# Change ownership
RUN chown -R sandbox:sandbox /sandbox

# Switch to non-privileged user
USER sandbox

# Default command
CMD ["python", "solution.py"]
