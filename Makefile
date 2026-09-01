.PHONY: install dev build lint typecheck clean

install:
	bun install

dev:
	bun run dev

build:
	bun run build

lint:
	bun run lint

typecheck:
	bunx tsc --noEmit

clean:
	rm -rf dist node_modules
