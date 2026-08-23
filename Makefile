.PHONY: install dev build lint typecheck clean

install:
	npm install

dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint

typecheck:
	npx tsc --noEmit

clean:
	rm -rf dist node_modules
