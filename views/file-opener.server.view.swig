{% extends "vendor/core/views/layout.server.view.swig" %}

{% block content %}
<style>
  p {
    text-align: center;
    font-size: 18px;
  }
  i.fa {
    font-size: 55px;
    color: #93b793;
    margin-top: 20px;
  }
  b {
    color: #dc6767;
  }
</style>
<p>
  Opening the file...
</p>
<script type="text/javascript">
  if(typeof window.close === 'function') {
    window.close();
  }
</script>
{% endblock %}
