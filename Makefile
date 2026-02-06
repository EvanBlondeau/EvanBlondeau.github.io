.PHONY: help serve check-links open

PYTHON ?= python3
LYCHEE ?= lychee
PORT ?= 8081
URL ?= http://localhost:$(PORT)

help:
	@echo "Cibles disponibles :"
	@echo "  make serve         Lance le serveur local via dev/server.py"
	@echo "  make check-links   Vérifie les liens avec lychee"
	@echo "  make open          Ouvre le site dans le navigateur ($(URL))"

serve:
	$(PYTHON) dev/server.py

check-links:
	@$(LYCHEE) --no-progress --exclude 'https://www\.linkedin\.com/.*' $$(find . -name "*.html" -print)

open:
	@xdg-open $(URL) >/dev/null 2>&1 || true
