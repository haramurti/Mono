<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


## Project Overview

This is a frontend project built with:

- Next.js App Router
- TypeScript
- TailwindCSS
- shadcn/ui
- TanStack Query for remote/server state
- Zustand for client/local state
- Axios for HTTP transport
- React Hook Form + zodResolver for form validation
- Zod for form validation and environment parsing
- nuqs for URL search params when needed

Always follow `DESIGN.md` for visual direction, spacing, layout, component composition, and UI consistency.

## Language and Communication

- Use Indonesian when explaining implementation decisions to the project owner.
- Code, comments, filenames, variables, and commit messages should use English unless the existing codebase clearly uses another convention.
- Be concise but explicit about architectural decisions.
- Do not introduce new libraries unless there is a clear benefit and the project owner approves.

## Project Structure

Use a feature-based structure.

```txt
src/
  app/
  features/
  shared/
```

````

### `src/app`

Use `src/app` only for routing and global wiring.

Allowed here:

- `page.tsx`
- `layout.tsx`
- loading/error/not-found boundaries
- route groups
- global providers wiring
- metadata
- middleware-related routing integration

Rules:

- Keep `page.tsx` thin.
- Do not put large business logic in `app`.
- Compose feature containers/components from `page.tsx`.
- For interactive app pages, prefer rendering a client feature container.

Example:

```tsx
import { ProductsContainer } from '@/features/products/containers/products-container';

export default function ProductsPage() {
   return <ProductsContainer />;
}
```

### `src/features`

Each domain or use case should have its own folder.

Examples:

```txt
src/features/
  auth/
  profile/
  form-management/
  orders/
  products/
```

Use subfolders as needed:

```txt
src/features/<domain>/
  components/
  containers/
  hooks/
  context/
  schemas/
  sections/
  types/
```

Folder responsibilities:

- `components/`: presentational components.
- `containers/`: components that connect UI with queries, mutations, Zustand, URL params, or orchestration logic.
- `hooks/`: feature-specific custom hooks.
- `context/`: local feature context only when needed.
- `schemas/`: zod schemas for forms.
- `sections/`: landing/home sections when needed.
- `types/`: types only used by that feature.

Rules:

- Do not turn feature components into dumping grounds.
- Separate UI, orchestration, hooks, and data access.
- Presentational components should receive data through props when possible.
- Feature code may import from `shared`.
- Avoid importing from another feature unless strongly justified.

### `src/shared`

Use `src/shared` for reusable code across features.

```txt
src/shared/
  components/
    ui/
    providers/
  hooks/
  lib/
  repository/
  styles/
  types/
```

Responsibilities:

- `components/ui/`: shadcn/ui primitives and design-system primitives.
- `components/providers/`: global providers.
- `components/`: reusable wrapper components used across features.
- `hooks/`: generic/global hooks.
- `lib/`: helpers, env config, axios client, utilities.
- `repository/`: centralized data access per domain.
- `styles/`: global styles.
- `types/`: global/shared types.

## Import Rules

Use the configured alias:

```ts
import { cn } from '@/shared/lib/utils';
```

Rules:

- Use `@/*` for imports from `src/*`.
- Avoid deep relative imports like `../../../`.
- Prefer named exports for reusable modules.
- Keep dependency direction:

```txt
app -> features -> shared
```

Allowed:

- `app` imports from `features` and `shared`.
- `features` imports from `shared`.
- `shared` must not import from `features` or `app`.

Avoid:

- Cross-feature imports unless justified.
- Business logic in `app`.
- Transport/data access inside UI components.

## Component Rules

Default component strategy:

- Landing/static marketing pages may use Server Components.
- App/dashboard/interactive feature pages are client-first.
- Use `"use client"` for containers or components that use:
   - TanStack Query
   - Zustand
   - React Hook Form
   - event handlers
   - browser APIs
   - URL search param hooks
   - local interactive state

Example:

```tsx
'use client';

export function ProductsContainer() {
   return <div>{/* query + orchestration */}</div>;
}
```

Presentational component rules:

- Keep components focused and small.
- Pass data via props.
- Avoid direct query/mutation calls in presentational components.
- Keep heavy orchestration in containers or hooks.

Interactive app page composition rules:

- These rules apply to interactive app/dashboard pages and interactive feature flows.
- Containers are the composition layer for interactive pages.
- Containers may assemble leaf components, section components, controller hooks, and pure helper/selector functions.
- Prefer leaf-first or section-first composition over a single page-wide view wrapper.
- Presentational components must receive narrow, purpose-specific props.
- Do not pass one broad page-wide prop bag into a monolithic `*View` component unless there is a strong, explicit justification.
- Presentational components must not import from feature controller hook files.
- Presentational components must not depend on controller hook result types.
- Controller hooks may own query/mutation orchestration, router integration, search-param integration, local UI state, and event handlers.
- Controller hooks must not export page-wide `*ViewModel` objects intended to drive a whole presentational tree.
- Prefer pure helper/selectors for display derivation such as labels, formatting, status mapping, and lightweight UI shaping.
- If logic is too cluttered to keep inline, extract a dedicated function with an explicit name.
- Compound component APIs are allowed only when they improve discoverability and still keep data flow explicit and props-first.
- Context-heavy compound patterns are disallowed by default.
- Use feature-local context only when sibling subtree coordination makes props genuinely unreasonable.

Valid seam for interactive pages:

- Container: assembles the page from sections/leaves.
- Controller hook: owns orchestration and state transitions.
- Helper/selector: owns pure display derivation.
- Presentational component: renders UI from explicit props only.

Avoid pattern:

```tsx
const viewModel = useFeatureViewModel();
return <FeatureView {...viewModel} />;
```

Preferred pattern:

```tsx
const controller = useFeatureController();
const headerLabel = getHeaderLabel(controller.data);

return (
   <FeatureShell>
      <FeatureHeader label={headerLabel} onOpen={controller.openPanel} />
      <FeatureSection items={mapItems(controller.data)} />
   </FeatureShell>
);
```

## Styling Rules

Use:

- TailwindCSS
- shadcn/ui
- `DESIGN.md` as the source of truth for visual decisions

Rules:

- Prefer shadcn/ui primitives for common UI.
- Use Tailwind utility classes directly when readable.
- Create reusable wrapper components when a UI pattern repeats across features.
- Put reusable global wrappers in `src/shared/components`.
- Keep domain-specific wrappers inside the related feature.
- Do not over-abstract too early.

## Data Access and Repository Pattern

Use this structure for API/data access:

```txt
src/shared/repository/<domain>/
  action.ts
  query.ts
  dto.ts
```

Responsibilities:

### `action.ts`

Contains async functions for API calls or server actions.

Rules:

- Use the global `apiClient`.
- Do not put UI logic here.
- Do not use React hooks here.
- Unwrap API responses here.
- Throw errors for unsuccessful API responses.

### `query.ts`

Contains TanStack Query hooks.

Rules:

- Define query keys here.
- Use `useQuery` and `useMutation` here.
- Invalidate queries after successful mutations by default.
- Use optimistic updates only for case-specific performance optimization.

### `dto.ts`

Contains request/response DTO types for the domain.

Rules:

- API response DTOs use TypeScript types/interfaces.
- Do not validate API responses with zod by default.
- Zod is only for form validation and env parsing.

## API Response Shape

Use this shared API response type:

```ts
export type ApiResponse<T> =
   | { success: true; data: T; message: string }
   | { success: false; error: string; message: string };
```

Recommended location:

```txt
src/shared/types/api.ts
```

For paginated endpoints, use:

```ts
export type PaginationMeta = {
   page: number;
   limit: number;
   total: number;
   totalPages: number;
};

export type PaginatedResponse<T> = {
   items: T[];
   meta: PaginationMeta;
};
```

List endpoints should usually return:

```ts
ApiResponse<PaginatedResponse<EntityDto>>;
```

Example action:

```ts
import { apiClient } from '@/shared/lib/axios';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/api';

import type { ProductDto, GetProductsParams } from './dto';

export async function getProducts(params: GetProductsParams) {
   const response = await apiClient.get<
      ApiResponse<PaginatedResponse<ProductDto>>
   >('/products', { params });

   if (!response.data.success) {
      throw new Error(response.data.message || response.data.error);
   }

   return response.data.data;
}
```

## Axios

Use one global Axios instance.

Recommended location:

```txt
src/shared/lib/axios.ts
```

Example:

```ts
import axios from 'axios';

import { env } from '@/shared/lib/env';

export const apiClient = axios.create({
   baseURL: env.NEXT_PUBLIC_API_BASE_URL,
});
```

Rules:

- Do not create random Axios instances in feature code.
- Use interceptors for default/global error handling when needed.
- Keep endpoint-specific logic in repository `action.ts`.

## Environment Config

Use a typed env wrapper.

Recommended location:

```txt
src/shared/lib/env.ts
```

Rules:

- Only read `process.env` inside `env.ts`.
- Parse env with zod.
- Import `env` from `@/shared/lib/env` everywhere else.
- Client-side env values must use `NEXT_PUBLIC_*`.

Example:

```ts
import { z } from 'zod';

const envSchema = z.object({
   NEXT_PUBLIC_API_BASE_URL: z.string().url(),
});

export const env = envSchema.parse({
   NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
});
```

## TanStack Query

Use TanStack Query for remote/server state.

Rules:

- Query keys must be stable and reusable.
- Put query keys in `query.ts`.
- Mutation success should invalidate related queries by default.
- Use optimistic updates only when specifically useful.
- Do not store remote resource data in Zustand by default.

Example:

```ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getProducts, updateProduct } from './action';

export const productQueryKeys = {
   all: ['products'] as const,
   lists: () => [...productQueryKeys.all, 'list'] as const,
   list: (params: unknown) => [...productQueryKeys.lists(), params] as const,
};

export function useProductsQuery(params: GetProductsParams) {
   return useQuery({
      queryKey: productQueryKeys.list(params),
      queryFn: () => getProducts(params),
   });
}

export function useUpdateProductMutation() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: updateProduct,
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: productQueryKeys.lists(),
         });
      },
   });
}
```

## Zustand

Use Zustand for client/local state.

Good use cases:

- UI state shared across components
- local workflow state
- modal/sheet state if global
- temporary client-only preferences
- complex local state that does not belong in URL

Avoid:

- Storing server state already managed by TanStack Query.
- Storing list filters/search/page when they should be in URL search params.

## URL Search Params

For list state, use URL search params as the source of truth.

Use cases:

- pagination
- search
- filter
- sort
- tab state when shareable/bookmarkable

Use `nuqs` when helpful.

Example:

```ts
'use client';

import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';

export function useProductSearchParams() {
   return useQueryStates({
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10),
      search: parseAsString.withDefault(''),
      sort: parseAsString.withDefault('createdAt:desc'),
   });
}
```

Rules:

- Prefer URL params over Zustand for list params.
- Use local state only for transient UI state.
- Keep params parsing inside feature hooks.

## Forms

Use:

- React Hook Form
- zod
- zodResolver

Recommended structure:

```txt
src/features/<domain>/
  components/
    <entity>-form.tsx
  hooks/
    use-<entity>-form.ts
  schemas/
    <entity>-schema.ts
```

Rules:

- Use zod for form validation.
- Use `zodResolver`.
- Keep form schema in `schemas/`.
- Put complex form setup in `use-*-form.ts`.
- Put submit orchestration in a container or feature hook.
- Keep form UI component presentational when possible.

Example schema:

```ts
import { z } from 'zod';

export const productFormSchema = z.object({
   name: z.string().min(1, 'Name is required'),
   price: z.coerce.number().min(0),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
```

## Error Handling

Use two layers of error handling:

1. Global default error handling
2. Feature/container-level graceful error handling

Global:

- Axios interceptor and/or React Query default error handling may show default toast.
- Keep default error message generic and safe.

Feature/container:

- May show contextual empty states.
- May show inline errors.
- May provide retry actions.
- May customize toast messages for better UX.

Rules:

- Do not put UI-specific error handling in repository actions.
- `action.ts` should throw meaningful errors.
- Containers decide how errors are presented.

## Auth and Route Protection

Default route protection:

- Use Next.js middleware first.
- Use layout guard or client-side guard only when additional heavy or UI-aware logic is needed.

Recommended locations:

```txt
src/middleware.ts
src/app/(protected)/layout.tsx
src/features/auth/
src/shared/lib/auth.ts
src/shared/repository/auth/
```

Rules:

- Do not put large auth orchestration in `page.tsx`.
- Keep auth data access in repository.
- Keep auth UI and flows in `features/auth`.
- Use client-side guard only when the decision depends on client/browser state.

## Naming Conventions

Use consistent file naming:

```txt
*-container.tsx
use-*.ts
action.ts
query.ts
dto.ts
*-schema.ts
```

Examples:

```txt
products-container.tsx
product-form.tsx
use-product-form.ts
product-schema.ts
action.ts
query.ts
dto.ts
```

Rules:

- Use kebab-case for filenames.
- Use PascalCase for React components.
- Use camelCase for functions and variables.
- Use `useSomething` for hooks.
- Prefer explicit names over vague names like `data`, `helper`, or `utils`.

## Testing

UI testing is not required by default.

Still ensure:

- TypeScript passes.
- Lint passes.
- Build passes.
- Manual verification is possible for changed UI flows.

Before finalizing code changes, prefer running:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

If the project does not have these scripts, inspect `package.json` and use the available equivalent commands.

## Package Manager

Prefer the package manager already used by the repository.

Check lockfiles:

```txt
pnpm-lock.yaml -> pnpm
yarn.lock -> yarn
package-lock.json -> npm
bun.lockb / bun.lock -> bun
```

Do not switch package managers unless explicitly requested.

## Implementation Workflow for AI Agents

When implementing a task:

1. Inspect existing project structure first.
2. Read relevant files before editing.
3. Follow existing patterns when they are consistent with this file.
4. If existing code conflicts with this file, prefer this file for new code unless the conflict would break consistency.
5. Keep changes focused on the requested task.
6. Avoid unrelated refactors.
7. Do not introduce new abstractions unless they reduce duplication or clarify intent.
8. Keep files thin and responsibilities clear.
9. Use repository functions for data access.
10.   Use containers/hooks for orchestration.
11.   Use presentational components for UI rendering.
12.   Validate that every new abstraction creates a real seam, not just moves coupling elsewhere.
13.   Prefer controller hook + helper functions + container composition over page-wide view-model wrappers.
14.   If a wrapper component does not improve reuse, readability, or composition, do not create it.

## Do Not Do

Do not:

- Put business logic in `page.tsx`.
- Put API calls directly inside presentational components.
- Store server state in Zustand by default.
- Parse API responses with zod by default.
- Create multiple Axios clients without justification.
- Add UI tests unless explicitly requested.
- Ignore `DESIGN.md`.
- Add new dependencies without approval.
- Create cross-feature coupling casually.
- Use relative import chains like `../../../shared`.
- Mix transport logic, orchestration, and UI in one component.
- Create page-wide `*ViewModel` objects for presentational trees in interactive app pages.
- Create monolithic `*View.tsx` wrappers for interactive app pages when the container can compose smaller sections directly.
- Make presentational components depend on controller hook result types.
- Hide page assembly behind one broad prop object unless there is a strong documented exception.
- Use context-heavy compound component patterns by default.

## When Unsure

Default decisions:

- Put route composition in `app`.
- Put domain UI and orchestration in `features/<domain>`.
- Put reusable code in `shared`.
- Put API calls in `shared/repository/<domain>/action.ts`.
- Put React Query hooks in `shared/repository/<domain>/query.ts`.
- Put DTO types in `shared/repository/<domain>/dto.ts`.
- Put form schemas in `features/<domain>/schemas`.
- Put list params in URL search params.
- Use invalidate-query mutation flow.
- Use optimistic update only when specifically useful.
- For interactive pages, compose UI in the container.
- Put orchestration in a controller hook.
- Put display derivation in pure helper functions.
- Keep section and leaf components props-first.
- If inline logic becomes hard to scan, extract a dedicated function.
````
