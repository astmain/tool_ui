# U1Design Vue Component Library Design

## Goal

Build U1Design as a Vue ecosystem component library and documentation site.

The package name is `@u1design/vue`. The first usable components are `U1Button`, `U1Input`, `U1Radio`, and `U1Card`. Other planned components are listed in the documentation site as not developed.

## Reference

The documentation experience should follow the structure and visual language of Element Plus component docs.

- Top navigation for brand and site level actions.
- Left sidebar for component categories and component links.
- Main content area for overview pages, component demos, API tables, and code examples.
- Component overview grouped into common UI library categories.

The implementation should use U1Design names, component prefixes, and CSS class prefixes instead of Element Plus naming.

## Technical Approach

Use Vite, Vue 3, TypeScript, and VitePress.

- `packages/components` stores Vue component source, styles, and library entry files.
- `docs` stores the VitePress documentation site.
- The docs app imports the local component package directly during development.
- The component package can be built as `@u1design/vue` for Vue projects.

## Component Naming

- Package name: `@u1design/vue`
- Components: `U1Button`, `U1Input`, `U1Radio`, `U1Card`
- CSS classes: `.u1-button`, `.u1-input`, `.u1-radio`, `.u1-card`

## First Components

### Button

`U1Button` supports common button states and variants.

- Variants: default, primary, success, warning, danger, info
- Sizes: large, default, small
- States: disabled, loading
- Shapes: plain, round, circle

### Input

`U1Input` supports basic form input use.

- `v-model` value binding
- Placeholder
- Disabled state
- Clearable input
- Password input

### Radio

`U1Radio` supports single option and grouped radio use.

- `v-model` value binding
- Disabled state
- Label based selection
- `U1RadioGroup` for option groups

### Card

`U1Card` supports common content container use.

- Header slot
- Default content slot
- Footer slot
- Shadow modes

## Documentation Pages

The first documentation set includes these pages.

- Home page with U1Design introduction and quick install.
- Component overview page with developed and not developed tags.
- Button page with demos and API.
- Input page with demos and API.
- Radio page with demos and API.
- Card page with demos and API.

## Not Developed Components

The component overview and sidebar list planned components with a not developed tag.

- Basic: Icon, Link, Text, Scrollbar
- Layout: Layout, Container, Grid, Space, Divider
- Form: Checkbox, Select, Switch, DatePicker, TimePicker, Upload, Form
- Data: Table, Tag, Progress, Tree, Pagination, Badge, Avatar
- Navigation: Menu, Tabs, Breadcrumb, Dropdown, Steps
- Feedback: Dialog, Drawer, Message, Notification, Tooltip, Popover, Popconfirm
- Others: Carousel, Collapse, Calendar, Backtop, InfiniteScroll

## Interactivity

The docs site should be interactive.

- Sidebar navigation changes pages.
- Developed component demos use real Vue state.
- Inputs and radios demonstrate `v-model`.
- Disabled and loading states are visible.
- Not developed components are visible but not linked to real docs unless a placeholder page is added later.

## Testing

Add tests around the reusable component behavior before implementation.

- Button renders text, variant class, disabled state, and loading state.
- Input emits model updates, clears value, and supports disabled state.
- Radio and RadioGroup update model values.
- Card renders header, default, footer, and shadow class.

## Build And Verification

The implementation is complete when these checks pass.

- TypeScript typecheck succeeds.
- Component tests pass.
- Component library build succeeds.
- Documentation site build succeeds.
- Local documentation site renders the overview and the four developed component pages.

