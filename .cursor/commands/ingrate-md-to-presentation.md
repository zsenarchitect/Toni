# Markdown File Management Policy

This project follows a **zero markdown file policy**. All markdown files should be either:

1. **Trashed** - If the file is temporary or a summary of a completed action
2. **Integrated into presentations** - If the content has lasting value:
   - **External Presentation** (`hair-vision/src/app/presentation/external/page.tsx`) - For sales, marketing, or client-facing content
   - **Internal Presentation** (`hair-vision/src/app/presentation/internal/page.tsx`) - For technical documentation, business plans, or internal strategy

## Decision Guidelines

- **External Presentation**: Use for content that would be shown to clients, investors, or external stakeholders
- **Internal Presentation**: Use for technical specs, internal planning, development notes, or business strategy
- **When unsure**: Ask the user before making a decision

## Process

When encountering markdown files:
1. Review the content and determine its purpose
2. If temporary/obsolete → delete
3. If valuable → integrate into the appropriate presentation format
4. Remove the original markdown file after integration
