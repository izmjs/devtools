{{description}}

**IAM**: `{{iam}}`

{% if exclude.found %}
THIS API WAS EXCLUDED:
=====================
`Reason`: `{{ exclude.reason | upper }}`

`Data`: `{{ exclude.data }}`
{% endif %}

{% if middlewares.length > 0 %}
Middlewares:
===========
{% for m in middlewares %}
{% if m.link %}
  {{loop.index}}- [{{ m.name }}]({{ m.link | safe }})
{% else %}
  {{loop.index}}- {{ m.name }}
{% endif %}
{% endfor %}
{% endif %}

{% if parents.length > 0 %}
Parents:
===========
{% for p in parents %}
  {{loop.index}}- `{{ p.ref }}`
{% endfor %}
{% endif %}
