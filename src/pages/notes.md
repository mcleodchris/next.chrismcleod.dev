---
title: Notes
description: 'Short notes, newest first'
layout: notes
pagination:
  data: collections.allNotes
  size: 25
permalink: '/notes/{% if pagination.pageNumber > 0 %}page-{{ pagination.pageNumber }}/{% endif %}index.html'
---
