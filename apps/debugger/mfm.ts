import HtmlParserService from '@dhaaga/shared-utility-html-parser/src/htmlparser2';

const input =
	'<p>👋 <a href="https://mastodon.social/tags/introduction" class="mention hashtag" rel="tag">#<span>introduction</span></a></p><p>Hey! Debashish here. You can call me Deb.<br />I go online as <span class="h-card" translate="no"><a href="https://mastodon.social/@suvam" class="u-url mention">@<span>suvam</span></a></span>(0451).</p><p>I am a full-stack webdev.</p><p>You can find me on Discord and Mastodon.<br />Feel free to interact/DM.<br />I work remotely from the countryside. <br />So, I appreciate the company 😆.<br /> <br />Oh, I am also building a Mastodon client.<br />It focuses on adding features I wish ActivityPub had by default.<br />You can just follow these hashtags (or follow me 😉):</p><p>- <a href="https://mastodon.social/tags/DhaagaApp" class="mention hashtag" rel="tag">#<span>DhaagaApp</span></a> (discussions)<br />- <a href="https://mastodon.social/tags/DhaagaDev" class="mention hashtag" rel="tag">#<span>DhaagaDev</span></a> (me being noob)<br />- <a href="https://mastodon.social/tags/DhaagaUpdates" class="mention hashtag" rel="tag">#<span>DhaagaUpdates</span></a> (releases)</p>';
console.log(input);
const res = HtmlParserService.cleanup(input);
console.log(res);
